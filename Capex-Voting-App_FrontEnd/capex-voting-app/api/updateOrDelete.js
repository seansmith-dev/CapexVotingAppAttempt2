import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  max: 20,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  console.log("the method is", req.method)
  const { projectId } = req.query;
  const projectNumber = projectId
  const client = await pool.connect();

  if (!projectNumber) {
    return res.status(400).json({ error: "Missing project number" });
  }

  try {
    await client.query("BEGIN");
    console.log("the method is", req.method)

    // if (req.method !== "PUT" && req.method !== "DELETE") {
    //   res.setHeader("Allow", ["PUT", "DELETE"]);
    //   console.log("the method is", req.method)
    //   return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    // }

    if (req.method === "PUT") {
      const { name, faculty } = req.body;

      if (!name || !faculty) {
        return res.status(400).json({ error: "Missing required fields: name or faculty" });
      }

      // 1. Check if faculty exists
      const facultyResult = await client.query(
        `SELECT faculty_id FROM "Facultys" WHERE faculty_name = $1`,
        [faculty]
      );

      let facultyId;
      if (facultyResult.rows.length > 0) {
        facultyId = facultyResult.rows[0].faculty_id;
      } else {
        // 2. Insert new faculty and get new id
        const insertFaculty = await client.query(
          `INSERT INTO "Facultys" (faculty_name) VALUES ($1) RETURNING faculty_id`,
          [faculty]
        );
        facultyId = insertFaculty.rows[0].faculty_id;
      }

      // 3. Update project using project_number
      const updateQuery = `
        UPDATE "Projects"
        SET project_title = $1,
            faculty_id = $2
        WHERE project_number = $3
        RETURNING *;
      `;

      const updateResult = await client.query(updateQuery, [name, facultyId, projectNumber]);

      if (updateResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Project not found" });
      }

      await client.query("COMMIT");
      res.status(200).json({ message: "Project updated successfully!" });

    } else if (req.method === "DELETE") {
      try {
        // 1. Get project_id from project_number
        const projectResult = await client.query(
          `SELECT project_id FROM "Projects" WHERE project_number = $1`,
          [projectNumber]
        );

        if (projectResult.rows.length === 0) {
          await client.query("ROLLBACK");
          return res.status(404).json({ error: "Project not found" });
        }

        const projectId = projectResult.rows[0].project_id;

        // 2. Delete from ProjectLeaderboardVotes
        await client.query(
          `DELETE FROM "ProjectLeaderboardVotes" WHERE project_id = $1`,
          [projectId]
        );

        // 3. Delete from Votes
        await client.query(
          `DELETE FROM "Votes" WHERE project_id = $1`,
          [projectId]
        );

        // 4. Delete from Projects
        await client.query(
          `DELETE FROM "Projects" WHERE project_id = $1`,
          [projectId]
        );

        await client.query("COMMIT");
        return res.status(200).json({ message: "Project deleted successfully" });

      } catch (err) {
        await client.query("ROLLBACK");
        console.error("Delete error:", err);
        return res.status(500).json({ error: "Internal server error during delete" });
      }
    } else {
      console.log(req.method)
      return res.status(405).json({ error: "Method not allowed" });
    }

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in project handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
}
