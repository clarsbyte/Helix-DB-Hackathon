import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface CognitoTokens {
  IdToken: string;
  AccessToken: string;
  RefreshToken: string;
}

/**
 * Cookie configuration for secure auth tokens
 */
const cookieOptions = {
  httpOnly: true, // Prevents JavaScript access (XSS protection)
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax' as const, // CSRF protection
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
};

/**
 * Set authentication cookies on the response
 *
 * @param response - NextResponse object to set cookies on
 * @param tokens - Cognito auth tokens (IdToken, AccessToken, RefreshToken)
 */
export function setAuthCookies(response: NextResponse, tokens: CognitoTokens): void {
  response.cookies.set('idToken', tokens.IdToken, cookieOptions);
  response.cookies.set('accessToken', tokens.AccessToken, cookieOptions);
  response.cookies.set('refreshToken', tokens.RefreshToken, cookieOptions);
}

/**
 * Clear all authentication cookies
 *
 * @param response - NextResponse object to clear cookies from
 */
export function clearAuthCookies(response: NextResponse): void {
  const clearOptions = {
    ...cookieOptions,
    maxAge: 0, // Expire immediately
  };

  response.cookies.set('idToken', '', clearOptions);
  response.cookies.set('accessToken', '', clearOptions);
  response.cookies.set('refreshToken', '', clearOptions);
}

/**
 * Get a specific token from request cookies
 *
 * @param request - NextRequest object to extract cookies from
 * @param tokenName - Name of the token cookie ('idToken', 'accessToken', or 'refreshToken')
 * @returns The token string or null if not found
 */
export function getTokenFromCookie(
  request: NextRequest,
  tokenName: 'idToken' | 'accessToken' | 'refreshToken'
): string | null {
  return request.cookies.get(tokenName)?.value || null;
}

/**
 * Check if user is authenticated by validating access token exists
 *
 * @param request - NextRequest object to check cookies
 * @returns True if access token exists, false otherwise
 */
export function isAuthenticated(request: NextRequest): boolean {
  const accessToken = getTokenFromCookie(request, 'accessToken');
  return !!accessToken;
}
