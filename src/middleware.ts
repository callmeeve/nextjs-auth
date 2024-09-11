// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow requests if the following conditions are met:
  // 1. It's a request to NextAuth session or providers
  // 2. The token exists (user is authenticated)

  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next();
  }

  // Redirect to the login page if not authenticated
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*'], // Protect these routes
};
