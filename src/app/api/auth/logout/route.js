import { NextResponse } from "next/server";

export async function GET() {
    const response = NextResponse.json({ message: "Logged out successfully" });

    // Clear ALL cookies
    response.cookies.getAll().forEach(cookie => {
        response.cookies.set(cookie.name, "", {
            path: "/",
            expires: new Date(0) // expired cookie
        });
    });

    return response;
}
