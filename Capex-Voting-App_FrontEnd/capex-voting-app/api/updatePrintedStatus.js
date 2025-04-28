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
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ids } = req.body; // <- getting ids array you passed
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "No voter IDs provided" });
  }

  try {
    console.log("Updating QR Codes...");

    // We will use a single query to update all matching rows
    const updateQuery = `
      UPDATE "qrcodes"
      SET "qr_code_printed_flag" = TRUE
      WHERE "qr_code_voter_id" = ANY($1::text[]);
    `;

    await pool.query(updateQuery, [ids]);

    console.log("QR Codes updated successfully.");

    return res.status(200).json({ success: true, updatedIds: ids });

  } catch (error) {
    console.error('Error updating QR Codes:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
