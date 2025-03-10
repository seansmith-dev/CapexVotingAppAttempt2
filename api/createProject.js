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

    let startTime = Date.now(); //How long does connection take

    pool.on('connect', (client) => {
      console.log('Connected to database'); //Is it actually connecting?
    });
    
    pool.on('error', (err) => {
      console.error('Database error:', err);
    });

    const { projectTitle, shortDescription, longDescription, facultyName, teamName, teamMembers } = req.body;
const client = await pool.connect();


let facultyId, teamId, projectId;


try {
    await client.query("BEGIN"); // Start transaction

    try{
    // Insert Faculty (or get existing one)
    const facultyQuery = `
        INSERT INTO "Facultys" (faculty_name)
        VALUES ($1)
        ON CONFLICT (faculty_name) DO NOTHING
        RETURNING faculty_id;
    `;
    const facultyResult = await client.query(facultyQuery, [facultyName]);
    const facultyId = facultyResult.rows.length > 0 
        ? facultyResult.rows[0].faculty_id 
        : (await client.query("SELECT faculty_id FROM Facultys WHERE faculty_name = $1", [facultyName])).rows[0].faculty_id;

      }
      catch(error){
        console.error("Error faculty:", error);
        res.status(500).json({ error: "Internal Server Error returning faculty" });
      }

      try{
    // Insert Team (or get existing one)
    const teamQuery = `
        INSERT INTO "Teams" (team_name)
        VALUES ($1)
        ON CONFLICT (team_name) DO NOTHING
        RETURNING team_id;
    `;
    const teamResult = await client.query(teamQuery, [teamName]);
    const teamId = teamResult.rows.length > 0
        ? teamResult.rows[0].team_id
        : (await client.query("SELECT team_id FROM Teams WHERE team_name = $1", [teamName])).rows[0].team_id;
      }
      catch(error){
        console.error("Error inserting team name:", error);
        res.status(500).json({ error: "Internal Server Error returning team name" });
      }

  

      try{
    // Insert Project
    const projectQuery = `
        INSERT INTO "Projects" (project_title, project_short_description, project_long_description, faculty_id, team_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;
    const projectResult = await client.query(projectQuery, [projectTitle, shortDescription, longDescription, facultyId, teamId]);
    const projectId = projectResult.rows[0].project_id;
      }
      catch(error){
        console.error("Error inserting project into project table:", error);
        res.status(500).json({ error: "Internal Server Error returning project" });
      }

    
    // Insert Members (or get existing ones) and link to TeamMembership
    const memberQuery = `
        INSERT INTO "Members" (member_name)
        VALUES ($1)
        ON CONFLICT (member_name) DO NOTHING
        RETURNING member_id;
    `;
    const teamMembershipQuery = `
        INSERT INTO "TeamMembership" (team_id, member_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;
    
    
      for (let member of teamMembers) {
        try{
          const memberResult = await client.query(memberQuery, [member]);
          const memberId = memberResult.rows.length > 0
              ? memberResult.rows[0].member_id
              : (await client.query("SELECT member_id FROM Members WHERE member_name = $1", [member])).rows[0].member_id;
          }
          catch(error){
            console.error("Error inserting into the members table:", error);
            res.status(500).json({ error: "Internal Server Error in the members table" });
          }
          try{
            await client.query(teamMembershipQuery, [teamId, memberId]);
          }
          catch(error){
            console.error("Error inserting into the teamMembership table:", error);
            res.status(500).json({ error: "Internal Server Error in the teamMembership table" });
          }
          
      }
    
    
    

    await client.query("COMMIT"); // Commit transaction
    res.status(201).json({ message: "Project successfully created", projectId });

} catch (error) {
    await client.query("ROLLBACK"); // Rollback transaction in case of error
    console.error("Error inserting project:", error);
    res.status(500).json({ error: "Internal Server Error" });
} finally {
    client.release();
}


}
