import { nanoid } from 'nanoid';  // Correct way to import nanoid
import QRCode from 'qrcode';      // Correct way to import qrcode
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
  console.log('Request from IP:', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
  
  if (req.headers['x-forwarded-for']) {
    console.log('Running on Vercel or other cloud provider');
  } else {
    console.log('Running locally');
  }
  //Some code to determine the ip address that vercel is being run on
  // What ip are they running our server on?

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }


    const token = nanoid(); // Generate a unique token
    let startTime = Date.now(); //How long does connection take

    pool.on('connect', (client) => {
      console.log('Connected to database'); //Is it actually connecting?
    });
    
    pool.on('error', (err) => {
      console.error('Database error:', err);
    });

    try {
        console.log("Starting database query...");
        const query = `
          INSERT INTO "qrcodes" ("qr_code_token", "project_id")
          VALUES ($1, NULL)
          RETURNING "qr_code_id", "qr_code_token";`;
        
        // Perform the query to insert the token into the database
        const result = await pool.query(query, [token]);
        console.log("Database query took: ", Date.now() - startTime, "ms");
        //Log how long it took to connect to db and query. 
        
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
