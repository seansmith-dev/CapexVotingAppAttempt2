import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sql } from '@vercel/postgres';

export async function middleware(request: NextRequest) {
    // Only protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Skip middleware for login page and API routes
        if (
            request.nextUrl.pathname === '/admin' ||
            request.nextUrl.pathname.startsWith('/api/')
        ) {
            return NextResponse.next();
        }

        const adminSession = request.cookies.get('admin_session');

        if (!adminSession) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        try {
            // Verify the session token in the database
            const result = await sql`
                SELECT admin_id 
                FROM "Sessions" 
                WHERE session_id = ${adminSession.value}
                AND expires_at > CURRENT_TIMESTAMP
            `;

            if (result.rows.length === 0) {
                // Invalid or expired session, redirect to login
                return NextResponse.redirect(new URL('/admin', request.url));
            }

            // Valid session, proceed
            return NextResponse.next();
        } catch (error) {
            console.error('Session verification error:', error);
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/admin/:path*",
};
