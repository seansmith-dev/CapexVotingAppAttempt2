import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@vercel/postgres';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        // Query the database for the admin
        const result = await sql`
            SELECT admin_id, admin_username, admin_password, admin_session_id 
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

        // In a real application, you should use proper password hashing
        // This is just for demonstration
        if (password !== admin.admin_password) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate a new session ID
        const sessionId = crypto.randomBytes(32).toString('hex');

        // Update the admin's session ID in the database
        await sql`
            UPDATE "Admin"
            SET admin_session_id = ${sessionId}
            WHERE admin_id = ${admin.admin_id}
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