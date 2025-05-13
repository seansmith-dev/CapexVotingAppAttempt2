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
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }


  const { leaderboard_type } = req.query;

  if (!leaderboard_type) {
    return res.status(400).json({ error: "Missing leaderboard_type query parameter" });
  }

  const leaderboardType = leaderboard_type.toUpperCase();

  try {
    // Step 1: Get the leaderboard_id from the type
    const leaderboardResult = await pool.query(
      `SELECT leaderboard_id FROM "Leaderboards" WHERE leaderboard_type = $1`,
      [leaderboardType]
    );

    if (leaderboardResult.rowCount === 0) {
      return res.status(404).json({ error: `Leaderboard type '${leaderboardType}' not found` });
    }

    const leaderboardId = leaderboardResult.rows[0].leaderboard_id;

    // Step 2: Get the sorted project list with vote_count, title, and faculty name
    const projectResult = await pool.query(`
      SELECT
        plv.project_id,
        p.project_title,
        f.faculty_name,
        plv.vote_count
      FROM "ProjectLeaderboardVotes" plv
      JOIN "Projects" p ON p.project_id = plv.project_id
      LEFT JOIN "Facultys" f ON p.faculty_id = f.faculty_id
      WHERE plv.leaderboard_id = $1
      ORDER BY plv.vote_count DESC;
    `, [leaderboardId]);

    return res.status(200).json({
      leaderboard_type,
      leaderboard_id: leaderboardId,
      projects: projectResult.rows,
    });

  } catch (error) {
    console.error("Error fetching leaderboard projects:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
