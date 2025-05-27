import { Pool } from 'pg';    // Default import of the entire 'pg' module
import Papa from 'papaparse';


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

  if (req.method !== "POST" && req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let startTime = Date.now(); // How long does connection take

  pool.on('connect', (client) => {
    console.log('Connected to database'); // Is it actually connecting?
  });

  pool.on('error', (err) => {
    console.error('Database error:', err);
  });

  const client = await pool.connect();

  try {
    if (req.method === "POST") {
      // Handle manual project creation
      const { project_title, faculty_name, project_code } = req.body;
      console.log("Received project data:", req.body);

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

      await client.query("BEGIN");

      // Get the next available project number
      const maxProjectNumberQuery = `
        SELECT COALESCE(MAX(project_number), 0) + 1 as next_project_number FROM "Projects";
      `;
      const maxProjectNumberResult = await client.query(maxProjectNumberQuery);
      const nextProjectNumber = maxProjectNumberResult.rows[0].next_project_number;

      // Insert Faculty (or get existing one)
      const facultyQuery = `
        INSERT INTO "Facultys" (faculty_name)
        VALUES ($1)
        ON CONFLICT (faculty_name) DO NOTHING
        RETURNING faculty_id;
      `;
      const facultyResult = await client.query(facultyQuery, [faculty_name]);
      let facultyId;
      
      if (facultyResult.rows.length > 0) {
        facultyId = facultyResult.rows[0].faculty_id;
      } else {
        const facultySelectQuery = `
          SELECT faculty_id FROM "Facultys" WHERE faculty_name = $1;
        `;
        const facultySelectResult = await client.query(facultySelectQuery, [faculty_name]);
        if (facultySelectResult.rows.length > 0) {
          facultyId = facultySelectResult.rows[0].faculty_id;
        } else {
          throw new Error("Faculty not found or failed to insert.");
        }
      }

      // Insert Project
      const projectQuery = `
        INSERT INTO "Projects" (project_id, project_title, faculty_id, project_code, project_number)
        VALUES (COALESCE((SELECT MAX(project_id) FROM "Projects"), 0) + 1, $1, $2, $3, $4)
        RETURNING project_id, project_number;
      `;
      const projectResult = await client.query(projectQuery, [project_title, facultyId, project_code, nextProjectNumber]);
      
      if (!projectResult.rows[0].project_id) {
        throw new Error('Failed to create project.');
      }

      await client.query("COMMIT");
      res.status(201).json({ 
        message: "Project created successfully!",
        projectId: projectResult.rows[0].project_id,
        projectNumber: projectResult.rows[0].project_number
      });

    } else if (req.method === "PUT") {
      // Handle CSV upload
      const csvData = req.body.csvData;
      if (!csvData) {
        console.log("No CSV data provided in request body");
        return res.status(400).json({ error: "No CSV data provided" });
      }

      console.log("Received CSV data:", csvData);
      console.log("CSV data type:", typeof csvData);
      console.log("CSV data length:", csvData.length);
      
      const results = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim() // Add trim to handle any whitespace
      });

      console.log("Papa Parse results:", {
        fields: results.meta.fields,
        errors: results.errors,
        data: results.data,
        rawHeaders: results.meta.fields
      });

      if (results.errors.length > 0) {
        console.log("CSV parsing errors:", results.errors);
        return res.status(400).json({ error: "Invalid CSV format" });
      }

      // Validate headers
      const requiredHeaders = ['project_name', 'project_code', 'faculty_name'];
      const headers = results.meta.fields;
      
      console.log("Checking headers:", {
        required: requiredHeaders,
        received: headers,
        match: requiredHeaders.every(header => headers.includes(header))
      });
      
      if (!headers || !requiredHeaders.every(header => headers.includes(header))) {
        return res.status(400).json({ 
          error: "CSV file must have headers 'project_name', 'project_code', and 'faculty_name'" 
        });
      }

      const projects = results.data;
      const processingResults = {
        successful: [],
        failed: []
      };

      await client.query("BEGIN");

      // Get the starting project number for the batch
      const maxProjectNumberQuery = `
        SELECT COALESCE(MAX(project_number), 0) + 1 as next_project_number FROM "Projects";
      `;
      const maxProjectNumberResult = await client.query(maxProjectNumberQuery);
      let currentProjectNumber = maxProjectNumberResult.rows[0].next_project_number;

      for (const project of projects) {
        try {
          // Validate required fields
          if (!project.project_name || !project.project_code || !project.faculty_name) {
            processingResults.failed.push({
              project: project,
              error: "Missing required fields"
            });
            continue;
          }

          // Check for duplicate project title
          const checkTitleQuery = `
            SELECT project_id 
            FROM "Projects"
            WHERE project_title = $1;
          `;
          const existingTitleResult = await client.query(checkTitleQuery, [project.project_name]);
          if (existingTitleResult.rows.length > 0) {
            processingResults.failed.push({
              project: project,
              error: "Project title already exists"
            });
            continue;
          }

          // Insert or get faculty
          const facultyQuery = `
            INSERT INTO "Facultys" (faculty_name)
            VALUES ($1)
            ON CONFLICT (faculty_name) DO NOTHING
            RETURNING faculty_id;
          `;
          const facultyResult = await client.query(facultyQuery, [project.faculty_name]);
          let facultyId;
          
          if (facultyResult.rows.length > 0) {
            facultyId = facultyResult.rows[0].faculty_id;
          } else {
            const facultySelectQuery = `
              SELECT faculty_id FROM "Facultys" WHERE faculty_name = $1;
            `;
            const facultySelectResult = await client.query(facultySelectQuery, [project.faculty_name]);
            facultyId = facultySelectResult.rows[0].faculty_id;
          }

          // Insert project
          const projectQuery = `
            INSERT INTO "Projects" (project_id, project_title, faculty_id, project_code, project_number)
            VALUES (COALESCE((SELECT MAX(project_id) FROM "Projects"), 0) + 1, $1, $2, $3, $4)
            RETURNING project_id, project_number;
          `;
          const projectResult = await client.query(projectQuery, [
            project.project_name,
            facultyId,
            project.project_code,
            currentProjectNumber
          ]);

          // Increment the project number for the next project in the batch
          currentProjectNumber++;

          processingResults.successful.push({
            project: project,
            projectId: projectResult.rows[0].project_id,
            projectNumber: projectResult.rows[0].project_number
          });

        } catch (error) {
          processingResults.failed.push({
            project: project,
            error: error.message
          });
        }
      }

      await client.query("COMMIT");
      res.status(200).json({
        message: "CSV processing completed",
        successful: processingResults.successful,
        failed: processingResults.failed
      });
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
}
