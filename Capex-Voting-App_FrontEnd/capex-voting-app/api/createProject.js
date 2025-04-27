import { Pool } from 'pg';    // Default import of the entire 'pg' module


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  max: 20,
  ssl: {
    rejectUnauthorized: false  // Bypass certificate validation
  }
});

export default async function handler(req, res) {
  console.log("DB_HOST: ", process.env.DB_HOST);
  console.log("DB_USER: ", process.env.DB_USER);
  console.log("DB_PASSWORD: ", process.env.DB_PASSWORD);
  console.log("DB_NAME: ", process.env.DB_NAME);

  const requestIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('Request from IP:', requestIp);

  if (req.headers['x-forwarded-for']) {
    console.log('Running on Vercel or other cloud provider');
  } else {
    console.log('Running locally');
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let startTime = Date.now(); // How long does connection take

  pool.on('connect', (client) => {
    console.log('Connected to database'); // Is it actually connecting?
  });

  pool.on('error', (err) => {
    console.error('Database error:', err);
  });

  // Destructure the constants from req.body
  const { project_title, faculty_name } = req.body;
  const client = await pool.connect();

  let facultyId,projectId 

  console.log("Received project data:", req.body);

  try {

    // Check if a project with the same title already exists
    const checkTitleQuery = `
        SELECT project_id 
        FROM "Projects"
        WHERE project_title = $1;
    `;
    const existingTitleResult = await client.query(checkTitleQuery, [project_title]);

    if (existingTitleResult.rows.length > 0) {
      console.log("same project title");
      return res.status(409).json({ message: "A project with this title already exists." });
    }

    await client.query("BEGIN"); // Start transaction

    try {
      // Insert Faculty (or get existing one)
      const facultyQuery = `
        INSERT INTO "Facultys" (faculty_name)
        VALUES ($1)
        ON CONFLICT (faculty_name) DO NOTHING
        RETURNING faculty_id;
    `;
      const facultyResult = await client.query(facultyQuery, [faculty_name]);
      if (facultyResult.rows.length > 0) {
        facultyId = facultyResult.rows[0].faculty_id;
      } else {
        // If no rows were returned, try to fetch the faculty_id explicitly
        const facultySelectQuery = `
          SELECT faculty_id FROM "Facultys" WHERE faculty_name = $1;
      `;
        const facultySelectResult = await client.query(facultySelectQuery, [faculty_name]);
        if (facultySelectResult.rows.length > 0) {
          facultyId = facultySelectResult.rows[0].faculty_id;
        } else {
          console.error("Faculty not found or inserted.");
          client.release();
          return res.status(500).json({ error: "Faculty not found or failed to insert." });
        }
      }

    }
    catch (error) {
      console.error("Error faculty:", error);
      res.status(500).json({ error: "Internal Server Error returning faculty" });
    }

    try {
      // Insert Project
      const projectQuery = `
        INSERT INTO "Projects" (project_title, faculty_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;
      const projectResult = await client.query(projectQuery, [project_title, facultyId]);
      projectId = projectResult.rows[0].project_id; // Assigned projectId correctly here
    }
    catch (error) {
      console.error("Error inserting project into project table:", error);
      res.status(500).json({ error: "Internal Server Error returning project" });
    }

    await client.query("COMMIT"); // Commit transaction

    res.status(201).json({ message: "Project created successfully!" });

  } catch (error) {
    await client.query("ROLLBACK"); // Rollback transaction in case of error
    console.error("Error inserting project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
}
