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

  const { projectNumber } = req.query;  // Get projectNumber from the query params
  const { projectTitle, shortDescription, longDescription, facultyName, teamName, teamMembers } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Start transaction

    // Check if project exists
    const checkProjectQuery = `SELECT project_id FROM "Projects" WHERE project_id = $1;`;
    const projectResult = await client.query(checkProjectQuery, [projectNumber]);

    if (projectResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Project not found" });
    }

    // Update Project details
    const updateProjectQuery = `
      UPDATE "Projects"
      SET project_title = $1, project_short_description = $2, project_long_description = $3
      WHERE project_id = $4;
    `;
    await client.query(updateProjectQuery, [projectTitle, shortDescription, longDescription, projectNumber]);

    // Update Faculty if provided
    if (facultyName) {
      const updateFacultyQuery = `
        UPDATE "Facultys" SET faculty_name = $1
        WHERE faculty_id = (SELECT faculty_id FROM "Projects" WHERE project_id = $2);
      `;
      await client.query(updateFacultyQuery, [facultyName, projectNumber]);
    }

    // Update Team if provided
    if (teamName) {
      const updateTeamQuery = `
        UPDATE "Teams" SET team_name = $1
        WHERE team_id = (SELECT team_id FROM "Projects" WHERE project_id = $2);
      `;
      await client.query(updateTeamQuery, [teamName, projectNumber]);
    }

    // Update Team Members if provided
    if (teamMembers && teamMembers.length > 0) {
      // Delete existing team members
      const deleteMembersQuery = `
        DELETE FROM "TeamMembership"
        WHERE team_id = (SELECT team_id FROM "Projects" WHERE project_id = $1);
      `;
      await client.query(deleteMembersQuery, [projectNumber]);

      // Insert new team members
      const memberInsertQuery = `
        INSERT INTO "Members" (member_first_name, member_second_name)
        VALUES ($1, $2)
        RETURNING member_id;
      `;
      const teamMembershipQuery = `
        INSERT INTO "TeamMembership" (team_id, member_id)
        VALUES ((SELECT team_id FROM "Projects" WHERE project_id = $1), $2);
      `;
      
      for (let member of teamMembers) {
        const memberResult = await client.query(memberInsertQuery, [member.firstName, member.lastName]);
        const memberId = memberResult.rows[0].member_id;
        await client.query(teamMembershipQuery, [projectNumber, memberId]);
      }
    }

    await client.query("COMMIT"); // Commit transaction
    res.status(200).json({ message: "Project updated successfully!" });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
}
