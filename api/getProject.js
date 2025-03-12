import pkg from 'pg'; // Import PostgreSQL client
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  max: 20,
  ssl: {
    rejectUnauthorized: false, // Bypass certificate validation
  },
});

export default async function handler(req, res) {
  console.log("DB_HOST:", process.env.DB_HOST);
  console.log("DB_USER:", process.env.DB_USER);
  console.log("DB_NAME:", process.env.DB_NAME);

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const { id } = req.query; // Get project number from request parameters

  if (!id) {
    return res.status(400).json({ error: "Missing project ID" });
  }

  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        p.project_number, 
        p.project_title, 
        p.project_long_description, 
        f.faculty_name AS faculty,
        t.team_name,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'first_name', m.member_first_name
            )
          ) FILTER (WHERE m.member_id IS NOT NULL), '[]'
        ) AS team_members
      FROM "Projects" p
      LEFT JOIN "Facultys" f ON p.faculty_id = f.faculty_id
      LEFT JOIN "Teams" t ON p.team_id = t.team_id
      LEFT JOIN "TeamMembership" tm ON t.team_id = tm.team_id
      LEFT JOIN "Members" m ON tm.member_id = m.member_id
      WHERE p.project_number = $1
      GROUP BY p.project_number, p.project_title, p.project_long_description, f.faculty_name, t.team_name;
    `;

    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json(result.rows[0]); // Send only the first row
  } catch (error) {
    console.error("Error fetching project details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
}
