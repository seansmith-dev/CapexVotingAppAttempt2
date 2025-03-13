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
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { projectNumber } = req.query; // Extract project_number from URL
  const client = await pool.connect();

  console.log('Delete request received for project:', projectNumber);

  try {
    await client.query("BEGIN"); // Start transaction

    // Get team_id associated with the project
    const teamQuery = `SELECT team_id FROM "Projects" WHERE project_number = $1;`;
    const teamResult = await client.query(teamQuery, [projectNumber]);

    if (teamResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Project not found." });
    }

    const teamId = teamResult.rows[0].team_id;

    // Step 1: Delete team memberships
    await client.query(`DELETE FROM "TeamMembership" WHERE team_id = $1;`, [teamId]);

    // Step 2: Delete members associated with the team
    await client.query(`DELETE FROM "Members" WHERE member_id IN (SELECT member_id FROM "TeamMembership" WHERE team_id = $1);`, [teamId]);

    // Step 3: Delete the team
    await client.query(`DELETE FROM "Teams" WHERE team_id = $1;`, [teamId]);

    // Step 4: Delete the project
    await client.query(`DELETE FROM "Projects" WHERE project_number = $1;`, [projectNumber]);

    await client.query("COMMIT"); // Commit transaction

    res.status(200).json({ message: "Project deleted successfully!" });

  } catch (error) {
    await client.query("ROLLBACK"); // Rollback on error
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
}
