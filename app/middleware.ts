import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authAdmin } from "@/lib/firebase_admin";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('auth_token');
    console.log('middleware');
    console.log(req.cookies);
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];
    return NextResponse.next();
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const decodedToken = await authAdmin.verifyIdToken(token);
        return NextResponse.next();
        // return NextResponse.json({ message: "Authenticated", user: decodedToken });
    } catch (error) {
        return NextResponse.redirect(new URL('/'));
    }
}



export const config = {
    matcher: ["/api/:path*", "/:path*"],
};
