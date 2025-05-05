import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        // Validate input
        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

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

        // Verify password (assuming passwords are hashed in the database)
        const isValidPassword = await bcrypt.compare(password, admin.admin_password);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate a new session ID
        const sessionId = uuidv4();

        // Update the admin's session ID in the database
        await sql`
            UPDATE "Admin"
            SET admin_session_id = ${sessionId}
            WHERE admin_id = ${admin.admin_id}
        `;

        // Set the session cookie
        const cookieStore = await cookies();
        cookieStore.set('admin-token', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 // 30 days
        });

        return NextResponse.json({
            success: true,
            admin: {
                id: admin.admin_id,
                username: admin.admin_username
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 