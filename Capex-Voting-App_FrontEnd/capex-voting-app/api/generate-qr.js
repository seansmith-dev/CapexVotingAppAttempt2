import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { codes } = req.body; // Expect an array of QR code objects with { voterId, voterType }
  
  if (!codes || codes.length === 0) {
    return res.status(400).json({ error: "No QR codes provided" });
  }

  let startTime = Date.now();
  const qrCodeIds = [];

  pool.on('connect', (client) => {
    console.log('Connected to database');
  });

  pool.on('error', (err) => {
    console.error('Database error:', err);
  });



  try {
    console.log("Starting database query...");

    //  Check if the specific leaderboards exist, and insert them if not
     const checkLeaderboardQuery = `
     SELECT * FROM "Leaderboards" WHERE "leaderboard_type" IN ('GUEST', 'INDUSTRY');
   `;
   const checkResult = await pool.query(checkLeaderboardQuery);

   const existingLeaderboards = checkResult.rows.map(row => row.leaderboard_type);

   const leaderboardsToInsert = [];

   if (!existingLeaderboards.includes('GUEST')) {
     leaderboardsToInsert.push('GUEST');
   }
   if (!existingLeaderboards.includes('INDUSTRY')) {
     leaderboardsToInsert.push('INDUSTRY');
   }

   if (leaderboardsToInsert.length > 0) {
     const insertLeaderboardQuery = `
       INSERT INTO "Leaderboards" ("leaderboard_type", "leaderboard_no_votes")
       VALUES ($1, 0)
       RETURNING "leaderboard_type";
     `;

     for (const leaderboardType of leaderboardsToInsert) {
       await pool.query(insertLeaderboardQuery, [leaderboardType]);
     }

     console.log(`Inserted missing leaderboards: ${leaderboardsToInsert.join(', ')}`);
   }

    // Insert QR Codes into the database
    const insertQuery = `
      INSERT INTO "qrcodes" ("leaderboard_id", "qr_code_token", "qr_code_printed_flag", "qr_code_voter_id")
      VALUES ($1, $2, $3, $4)
      RETURNING "qr_code_id", "qr_code_token", "leaderboard_id";
    `;

    // Loop through each code and insert into the database
    for (const code of codes) {
      const token = nanoid(); // Generate a unique token for each QR code
      const { voterId, voterType } = code;

      code.token = token;

      // Convert voterType to integer (0 for GUEST, 1 for INDUSTRY)
      const voterTypeInt = voterType === 'INDUSTRY' ? 1 : 0;

      // Insert each QR code and store its ID
      const result = await pool.query(insertQuery, [voterTypeInt, token, false, voterId]);
      if (result.rows.length > 0) {
        qrCodeIds.push(result.rows[0].qr_code_id);
      }
    }

    console.log("Database query took:", Date.now() - startTime, "ms");

    // Generate QR Codes as data URLs
    const qrImages = await Promise.all(
      codes.map(async (code) => {
        const qrUrl = `https://capex-voting-app-attempt2.vercel.app/vote?token=${code.token}`;
        const qrImage = await QRCode.toDataURL(qrUrl);
        return { 
          voterId: code.voterId, 
          voterType: code.voterType, 
          dataUrl: qrImage, 
        };
      })
    );

    return res.status(200).json({
      success: true,
      qrCodeIds,
      qrImages,
    });

  } catch (error) {
    console.error('Error generating or inserting QR Codes:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}



