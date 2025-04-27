import pkg from 'pg';  // Default import of the entire 'pg' module
const { Pool } = pkg;  // Destructure 'Pool' from the 'pg' module

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
  const { project_title, short_description, long_description, faculty_name, team_name, team_members } = req.body;
  const client = await pool.connect();

  let facultyId, teamId, projectId, memberId;

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

      // Insert Team (or get existing one)
      const teamQuery = `
          INSERT INTO "Teams" (team_name)
          VALUES ($1)
          ON CONFLICT (team_name) DO NOTHING
          RETURNING team_id;
      `;
      console.log("team query executed ");
      const teamResult = await client.query(teamQuery, [team_name]);
      if (teamResult.rows.length > 0) {
        console.log("team id was returned ");
        teamId = teamResult.rows[0].team_id;
      } else {
        // If the team already exists, send an error response that project already created
        console.log("Already created executing")
        return res.status(408).json({ message: "This team has already created a project." });
      }
    }
    catch (error) {
      console.error("Error inserting team name:", error);
      return res.status(500).json({ error: "Internal Server Error returning team name" });
    }


    try {
      // Insert Project
      const projectQuery = `
        INSERT INTO "Projects" (project_title, project_short_description, project_long_description, faculty_id, team_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;
      const projectResult = await client.query(projectQuery, [project_title, short_description, long_description, facultyId, teamId]);
      projectId = projectResult.rows[0].project_id; // Assigned projectId correctly here
    }
    catch (error) {
      console.error("Error inserting project into project table:", error);
      res.status(500).json({ error: "Internal Server Error returning project" });
    }


    // Insert Members (or get existing ones) and link to TeamMembership
    const memberInsertQuery = `
        INSERT INTO "Members" (member_first_name, member_second_name)
        VALUES ($1, $2)
        RETURNING member_id;
    `;

    const teamMembershipQuery = `
        INSERT INTO "TeamMembership" (team_id, member_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;

    for (let member of team_members) {

      if (!member.first_name) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Each team member must have a first name" });
      }

      try {
        const memberResult = await client.query(memberInsertQuery, [member.first_name, member.last_name]);
        memberId = memberResult.rows[0].member_id;
      }
      catch (error) {
        return res.status(500).json({ error: "Internal Server Error in the members table" });
      }

      try {
        await client.query(teamMembershipQuery, [teamId, memberId]);
      }
      catch (error) {
        console.error("Error inserting into the teamMembership table:", error);
        res.status(500).json({ error: "Internal Server Error in the teamMembership table" });
      }

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
