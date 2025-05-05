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
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { token, latitude, longitude } = req.body;

    if (!token) {
        return res.status(400).json({ error: "Token is required" });
    }

    if (!latitude || !longitude) {
        return res.status(400).json({ valid: false, error: "Location data is required" });
    }

    // Swinburne Hawthorn Campus Coordinates (approximate bounding box)
    const swinburneBounds = {
        minLat: -37.8245,
        maxLat: -37.8205,
        minLng: 145.0350,
        maxLng: 145.0420,
    };

    const isOnCampus =
        latitude >= swinburneBounds.minLat &&
        latitude <= swinburneBounds.maxLat &&
        longitude >= swinburneBounds.minLng &&
        longitude <= swinburneBounds.maxLng;

    if (!isOnCampus) {
        return res.status(403).json({ valid: false, error: "You must be on Swinburne Hawthorn campus to vote" });
    }

    try {
        console.log("Checking token in database:", token);
        const query = "SELECT qr_code_id FROM qrcodes WHERE qr_code_token = $1";
        const { rowCount } = await pool.query(query, [token]);

        if (rowCount === 0) {
            console.log("Token not found in database");
            return res.status(401).json({ valid: false, error: "Invalid or expired token" });
        }

        console.log("Token is valid and user is on campus");
        return res.status(200).json({ valid: true });

    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
