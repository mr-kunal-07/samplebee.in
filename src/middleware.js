import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("authToken")?.value;
    const pathname = req.nextUrl.pathname;

    // If user is NOT logged in and trying to access protected routes
    const protectedRoutes = ["/dashboard", "/profile", "/settings"];

    if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // If user is logged in and visits /login or /signup
    if (token && (pathname === "/login" || pathname === "/signup")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Handle route "/"
    if (pathname === "/") {
        if (token) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        } else {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

// 👇 Add "/" here so middleware applies on root!
export const config = {
    matcher: [
        "/",
        "/dashboard/:path*",
        "/profile/:path*",
        "/settings/:path*",
        "/login",
        "/signup",
    ],
};
