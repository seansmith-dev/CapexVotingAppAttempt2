import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
            // Use the adminLogin API endpoint for session verification
            const response = await fetch(new URL('/api/adminLogin', request.url), {
                headers: {
                    Cookie: `admin_session=${adminSession.value}`
                }
            });

            if (!response.ok) {
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
