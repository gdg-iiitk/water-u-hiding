import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('auth_token');
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

// Define the paths where this middleware should run
export const config = {
    matcher: ['/api/:path*'], // Runs only for /dashboard and its subroutes
};
