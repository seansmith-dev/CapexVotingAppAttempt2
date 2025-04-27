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

  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        p.project_number, 
        p.project_title, 
        f.faculty_name
      FROM "Projects" p
      JOIN "Facultys" f ON p.faculty_id = f.faculty_id
      ORDER BY p.project_number ASC;
    `;
    const result = await client.query(query);

    console.log("list of projects", result);
    // Return the fetched projects as JSON
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
}
