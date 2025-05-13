import { Pool } from 'pg';
import crypto from 'crypto';

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

// Helper function to clean up expired sessions
async function cleanupExpiredSessions() {
  try {
    const result = await pool.query('DELETE FROM "Sessions" WHERE expires_at < CURRENT_TIMESTAMP RETURNING session_id');
    console.log(`Cleaned up ${result.rowCount} expired sessions`);
  } catch (error) {
    console.error('Error cleaning up sessions:', error);
  }
}

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

  // Handle session check
  if (req.method === "GET") {
    try {
      const sessionId = req.cookies?.admin_session;
      console.log('Checking session:', sessionId);
      console.log('All cookies:', req.cookies);

      if (!sessionId) {
        console.log('No session found');
        return res.status(401).json({ error: 'No session found' });
      }

      // Clean up expired sessions
      await cleanupExpiredSessions();

      // Check if session exists and is valid
      const result = await pool.query(
        `SELECT a.admin_id, a.admin_username, s.expires_at 
         FROM "Admin" a
         JOIN "Sessions" s ON a.admin_id = s.admin_id
         WHERE s.session_id = $1 AND s.expires_at > CURRENT_TIMESTAMP`,
        [sessionId]
      );

      console.log('Session check result:', {
        found: result.rows.length > 0,
        expiresAt: result.rows[0]?.expires_at,
        currentTime: new Date()
      });

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid or expired session' });
      }

      return res.status(200).json({
        success: true,
        admin_id: result.rows[0].admin_id,
        username: result.rows[0].admin_username
      });

    } catch (error) {
      console.error('Session check error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Handle login
  if (req.method === "POST") {
    try {
      const { username, password } = req.body;

      // Query the database for the admin
      const result = await pool.query(
        'SELECT admin_id, admin_username, admin_password FROM "Admin" WHERE admin_username = $1',
        [username]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const admin = result.rows[0];

      // Check password
      if (password !== admin.admin_password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Clean up expired sessions
      await cleanupExpiredSessions();

      // Generate new session
      const sessionId = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      // Create new session
      await pool.query(
        'INSERT INTO "Sessions" (session_id, admin_id, expires_at) VALUES ($1, $2, $3)',
        [sessionId, admin.admin_id, expiresAt]
      );

      // Set the session cookie
      const cookieOptions = {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days in milliseconds
        sameSite: 'lax'
      };

      if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
      }

      // Format cookie string properly
      const cookieString = `admin_session=${sessionId}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`;

      res.setHeader('Set-Cookie', cookieString);

      return res.status(200).json({
        success: true,
        admin_id: admin.admin_id,
        username: admin.admin_username
      });

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
