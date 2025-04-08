import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Get the pathname of the request
    const path = request.nextUrl.pathname;

    // Check if it's an admin path
    if (path.startsWith("/admin")) {
        // Exclude the login page from protection

        // Check for the auth token in cookies
        const token = request.cookies.get("admin-token");

        // If no token is present, redirect to login
        if (!token) {
            if (path === "/admin") {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL("/admin", request.url));
        } else if (path === "/admin") {
            return NextResponse.redirect(
                new URL("/admin/dashboard", request.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/admin/:path*",
};
