import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@vercel/postgres';
import crypto from 'crypto';

// Helper function to clean up expired sessions
async function cleanupExpiredSessions() {
    try {
        await sql`DELETE FROM "Sessions" WHERE expires_at < CURRENT_TIMESTAMP`;
    } catch (error) {
        console.error('Error cleaning up sessions:', error);
    }
}

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        // Query the database for the admin
        const result = await sql`
            SELECT admin_id, admin_username, admin_password 
            FROM "Admin" 
            WHERE admin_username = ${username}
        `;

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const admin = result.rows[0];

        // Check password
        if (password !== admin.admin_password) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Clean up expired sessions
        await cleanupExpiredSessions();

        // Generate new session
        const sessionId = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

        // Create new session
        await sql`
            INSERT INTO "Sessions" (session_id, admin_id, expires_at) 
            VALUES (${sessionId}, ${admin.admin_id}, ${expiresAt.toISOString()})
        `;

        // Set the session cookie
        cookies().set('admin_session', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return NextResponse.json({
            success: true,
            admin_id: admin.admin_id,
            username: admin.admin_username
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const sessionId = cookies().get('admin_session')?.value;

        if (!sessionId) {
            return NextResponse.json(
                { error: 'No session found' },
                { status: 401 }
            );
        }

        // Clean up expired sessions
        await cleanupExpiredSessions();

        // Check if session exists and is valid
        const result = await sql`
            SELECT a.admin_id, a.admin_username 
            FROM "Admin" a
            JOIN "Sessions" s ON a.admin_id = s.admin_id
            WHERE s.session_id = ${sessionId} AND s.expires_at > CURRENT_TIMESTAMP
        `;

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Invalid or expired session' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            admin_id: result.rows[0].admin_id,
            username: result.rows[0].admin_username
        });

    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 