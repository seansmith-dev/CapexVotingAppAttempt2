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
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: "Token is required" });
    }

    try {
        console.log("Checking token in database:", token);
        const query = "SELECT qr_code_id FROM qrcodes WHERE qr_code_token = $1";
        const { rowCount } = await pool.query(query, [token]);

        if (rowCount === 0) {
            console.log("Token not found in database");
            return res.status(401).json({ valid: false, error: "Invalid or expired token" });
        }

        console.log("Token is valid");
        return res.status(200).json({ valid: true });

    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
