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

    // Insert QR Codes into the database
    const insertQuery = `
      INSERT INTO "qrcodes" ("qr_code__type", "qr_code_token", "qr_code_printed_flag")
      VALUES ($1, $2, $3)
      RETURNING "qr_code_id", "qr_code_token", "qr_code_type";
    `;

    // Loop through each code and insert into the database
    for (const code of codes) {
      const token = nanoid(); // Generate a unique token for each QR code
      const { voterId, voterType } = code;
      
      // Insert each QR code and store its ID
      const result = await pool.query(insertQuery, [voterType, token, true]);
      if (result.rows.length > 0) {
        qrCodeIds.push(result.rows[0].qr_code_id);
      }
    }

    console.log("Database query took:", Date.now() - startTime, "ms");

    // Generate QR Codes as data URLs
    const qrImages = await Promise.all(
      codes.map(async (code) => {
        const qrUrl = `https://capex-voting-appattempt2.vercel.app/?token=${code.voterId}`;
        const qrImage = await QRCode.toDataURL(qrUrl);
        return { voterId: code.voterId, dataUrl: qrImage };
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



