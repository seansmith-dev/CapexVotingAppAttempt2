import { nanoid } from 'nanoid';  // Correct way to import nanoid
import QRCode from 'qrcode';      // Correct way to import qrcode
import { Pool } from 'pg';


const pool = new Pool({
    user: process.env.DB_USER, 
    host: process.env.DB_HOST, 
    database: process.env.DB_NAME, 
    password: process.env.DB_PASSWORD, 
    port: 5432, 
  });

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const token = nanoid(); // Generate a unique token

    try {
        const query = `
          INSERT INTO "qrcodes" ("qr_code_token", "project_id")
          VALUES ($1, NULL)
          RETURNING "qr_code_token";`;
        
        // Perform the query to insert the token into the database
        const result = await pool.query(query, [token]);
        
        // If the insertion is successful, return the qr_code_id (auto-generated)
        const qrCodeId = result.rows[0].qr_code_id;
      } catch (error) {
        console.error('Error inserting QRCode:', error);
        res.status(500).json({ success: false, error: error.message });
      }
    
    const qrUrl = `https://capex-voting-app.vercel.app/?token=${token}`;

    try {
        // Generate QR Code as a data URL
        const qrImage = await QRCode.toDataURL(qrUrl);

        return res.status(200).json({
            success: true,
            qrCodeId,
            token,
            qrUrl,
            qrImage,
        });
    } catch (error) {
        console.error("QR Code generation error:", error);
        return res.status(500).json({ error: "Failed to generate QR code" });
    }

}
