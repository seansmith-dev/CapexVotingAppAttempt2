import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@vercel/postgres';

export async function GET() {
    try {
        const sessionId = cookies().get('admin_session')?.value;

        if (!sessionId) {
            return NextResponse.json(
                { error: 'No session found' },
                { status: 401 }
            );
        }

        // Query the database for the admin with this session ID
        const result = await sql`
            SELECT admin_id, admin_username 
            FROM "Admin" 
            WHERE admin_session_id = ${sessionId}
        `;

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Invalid session' },
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