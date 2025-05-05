import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@vercel/postgres';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('admin_session')?.value;

        if (!sessionId) {
            return NextResponse.json(
                { error: 'No session found' },
                { status: 401 }
            );
        }

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