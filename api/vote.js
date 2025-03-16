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
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed. Use PATCH.' });
  }

  const { token } = req.query; // Get the token from the query string
  const { project_number, project_title, project_long_description, project_short_description, faculty_name, team_name, team_members } = req.body;

  const client = await pool.connect();
  try {
    // Step 1: Query the qrcodes table to get the qr_code_id based on the provided token
    const qrQuery = 'SELECT qr_code_id FROM "qrcodes" WHERE qr_code_token = $1';
    const qrResult = await client.query(qrQuery, [token]);

    if (qrResult.rows.length === 0) {
      return res.status(404).json({ error: 'QR code not found.' });
    }

    const qr_code_id = qrResult.rows[0].qr_code_id;

    // Step 2: Insert a new vote into the votes table
    const voteQuery = `
      INSERT INTO "Votes" (project_id, qr_code_id, votestamp)
      VALUES ($1, $2, NOW()) 
      RETURNING vote_id;
    `;
    const voteResult = await client.query(voteQuery, [project_number, qr_code_id]);

    // Step 3: Return the result
    const vote_id = voteResult.rows[0].vote_id;
   
    // Return a response indicating the vote was successfully recorded
    return res.status(200).json({
      message: 'Vote successfully recorded',
      vote_id,
      project_number,
      qr_code_id,
      votestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error processing vote:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
}
