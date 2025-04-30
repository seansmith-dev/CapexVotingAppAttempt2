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
  const { projectId } = req.query;
  console.log("the method is", req.method)
  const projectNumber = projectId
  const client = await pool.connect();

  if (!projectNumber) {
    return res.status(400).json({ error: "Missing project number" });
  }

  try {
    await client.query("BEGIN");
    console.log("the method is", req.method)
    
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
      // You can plug in your existing delete logic here
      return res.status(501).json({ error: "Delete functionality not implemented in this version" });
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
