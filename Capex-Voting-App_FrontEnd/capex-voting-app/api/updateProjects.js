import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
    max: 20,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    if (req.method !== "PATCH") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Destructure variables correctly from request
    const { project_number } = req.query;
    const {
        project_title,
        project_short_description,
        project_long_description,
        faculty_name,
        team_name,
        team_members
    } = req.body;

    // Check required fields
    if (!project_number) {
        return res.status(400).json({ error: "Project number is required" });
    }

    if (!project_title || !project_short_description || !project_long_description) {
        return res.status(400).json({ error: "Project title, short description, and long description are required" });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN"); // Start transaction

        // Check if project exists
        try {
            const checkProjectQuery = `SELECT project_number FROM "Projects" WHERE project_number = $1;`;
            const projectResult = await client.query(checkProjectQuery, [project_number]);

            if (projectResult.rows.length === 0) {
                await client.query("ROLLBACK");
                return res.status(404).json({ error: "Project not found" });
            }
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Error checking project existence:", error);
            return res.status(500).json({ error: "Database error while checking project" });
        }

        // Update Project details
        try {
            const updateProjectQuery = `
                UPDATE "Projects"
                SET project_title = $1, project_short_description = $2, project_long_description = $3
                WHERE project_number = $4;
            `;
            await client.query(updateProjectQuery, [project_title, project_short_description, project_long_description, project_number]);
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Error updating project:", error);
            return res.status(500).json({ error: "Error updating project table" });
        }

        // Update Faculty if provided
        if (faculty_name) {
            try {
                await client.query("BEGIN"); // Start transfaction

                // Step 1: Get the current faculty_id for the project
                // Step 1: Get the current faculty_id for the project
                const getCurrentFacultyQuery = `
SELECT faculty_id FROM "Projects" WHERE project_number = $1;
`;
                const currentFacultyResult = await client.query(getCurrentFacultyQuery, [project_number]);

                if (currentFacultyResult.rows.length === 0) {
                    throw new Error("Project not found within faculty logic.");
                }

                const currentFacultyId = currentFacultyResult.rows[0].faculty_id;

                // Step 2: Get the count of projects associated with the current faculty
                const facultyUsageCountQuery = `
SELECT COUNT(*) FROM "Projects" WHERE faculty_id = $1;
`;
                const facultyUsageCountResult = await client.query(facultyUsageCountQuery, [currentFacultyId]);
                const facultyUsageCount = parseInt(facultyUsageCountResult.rows[0].count, 10);

                // Step 3: Check if the new faculty name already exists
                const checkFacultyQuery = `SELECT faculty_id FROM "Facultys" WHERE faculty_name = $1;`;
                const existingFaculty = await client.query(checkFacultyQuery, [faculty_name]);

                if (existingFaculty.rows.length > 0) {
                    // Faculty already exists → Reassign the project
                    const facultyId = existingFaculty.rows[0].faculty_id;
                    const updateProjectQuery = `
    UPDATE "Projects"
    SET faculty_id = $1
    WHERE project_number = $2;
`;
                    await client.query(updateProjectQuery, [facultyId, project_number]);

                    // Delete old faculty if unused
                    const deleteOldFacultyQuery = `
    DELETE FROM "Facultys"
    WHERE faculty_id = $1
    AND faculty_id NOT IN (SELECT DISTINCT faculty_id FROM "Projects")
    RETURNING faculty_id;
`;
                    const deleteResult = await client.query(deleteOldFacultyQuery, [currentFacultyId]);

                    if (deleteResult.rows.length > 0) {
                        console.log(`Deleted old faculty with ID: ${deleteResult.rows[0].faculty_id}`);
                    }
                } else {
                    if (facultyUsageCount > 1) {
                        // The faculty is shared → Create a new faculty record
                        const createFacultyQuery = `
        INSERT INTO "Facultys" (faculty_name)
        VALUES ($1)
        RETURNING faculty_id;
    `;
                        const newFacultyResult = await client.query(createFacultyQuery, [faculty_name]);
                        const newFacultyId = newFacultyResult.rows[0].faculty_id;

                        // Update the project to use the new faculty
                        const updateProjectQuery = `
        UPDATE "Projects"
        SET faculty_id = $1
        WHERE project_number = $2;
    `;
                        await client.query(updateProjectQuery, [newFacultyId, project_number]);
                    } else {
                        // The faculty is NOT shared → Update its name directly
                        const updateFacultyQuery = `
        UPDATE "Facultys"
        SET faculty_name = $1
        WHERE faculty_id = $2;
    `;
                        await client.query(updateFacultyQuery, [faculty_name, currentFacultyId]);
                    }
                }





            } catch (error) {
                await client.query("ROLLBACK"); // Rollback transaction if any error occurs
                console.error("Error updating faculty:", error);
                return res.status(500).json({ error: "Error updating faculty table" });
            }
        }


        // Update Team if provided
        if (team_name) {
            try {
                const updateTeamQuery = `
                    UPDATE "Teams" SET team_name = $1
                    WHERE team_id = (SELECT team_id FROM "Projects" WHERE project_number = $2);
                `;
                await client.query(updateTeamQuery, [team_name, project_number]);
            } catch (error) {
                await client.query("ROLLBACK");
                console.error("Error updating team:", error);
                return res.status(500).json({ error: "Error updating team table" });
            }
        }

        // Update Team Members if provided
        if (team_members && team_members.length > 0) {
            try {
                // Delete existing team members
                const deleteMembersQuery = `
                    DELETE FROM "TeamMembership"
                    WHERE team_id = (SELECT team_id FROM "Projects" WHERE project_number = $1);
                `;
                await client.query(deleteMembersQuery, [project_number]);

                // Insert new team members
                const memberInsertQuery = `
                    INSERT INTO "Members" (member_first_name, member_second_name)
                    VALUES ($1, $2)
                    RETURNING member_id;
                `;
                const teamMembershipQuery = `
                    INSERT INTO "TeamMembership" (team_id, member_id)
                    VALUES ((SELECT team_id FROM "Projects" WHERE project_number = $1), $2);
                `;

                for (let member of team_members) {
                    if (!member.first_name) {
                        await client.query("ROLLBACK");
                        return res.status(400).json({ error: "Each team member must have a first name" });
                    }
                    const memberResult = await client.query(memberInsertQuery, [member.first_name, member.second_name]);
                    const memberId = memberResult.rows[0].member_id;
                    await client.query(teamMembershipQuery, [project_number, memberId]);
                }
            } catch (error) {
                await client.query("ROLLBACK");
                console.error("Error updating team members:", error);
                return res.status(500).json({ error: "Error updating team members" });
            }
        }

        await client.query("COMMIT"); // Commit transaction
        res.status(200).json({ message: "Project updated successfully!" });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Unexpected error updating project:", error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        client.release();
    }
}
