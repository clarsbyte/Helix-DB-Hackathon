import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for server-side route protection
 * Runs before rendering protected routes
 */
export function middleware(request: NextRequest) {
  // Get access token from cookies
  const accessToken = request.cookies.get('accessToken')?.value;

  // Check if accessing protected route (/app/*)
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/app');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/signup');

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    // Add redirect parameter to return user after login
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing auth routes with token, redirect to app
  // Note: We don't validate the token here - let the app handle invalid tokens
  // This prevents redirect loops when tokens are expired
  if (isAuthRoute && accessToken) {
    // Only redirect if coming from a non-redirect source
    // This prevents loops when the user is being redirected back from /app
    const referer = request.headers.get('referer');
    const isComingFromApp = referer?.includes('/app');

    if (!isComingFromApp) {
      return NextResponse.redirect(new URL('/app', request.url));
    }
  }

  // Allow request to proceed
  return NextResponse.next();
}

/**
 * Configure which routes this middleware should run on
 */
export const config = {
  matcher: [
    '/app/:path*',     // Protect all /app routes
    '/login',          // Auth page (redirect if already logged in)
    '/signup',         // Auth page (redirect if already logged in)
  ],
};
