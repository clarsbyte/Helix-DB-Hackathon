import { NextRequest, NextResponse } from 'next/server';
import { GlobalSignOutCommand } from '@aws-sdk/client-cognito-identity-provider';
import { getCognitoClient } from '@/lib/cognito';
import { getTokenFromCookie, clearAuthCookies } from '@/lib/auth-cookies';

export async function POST(request: NextRequest) {
  try {
    // Extract access token from cookies
    const accessToken = getTokenFromCookie(request, 'accessToken');

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear auth cookies
    clearAuthCookies(response);

    // If access token exists, perform global sign out in Cognito
    if (accessToken) {
      try {
        const command = new GlobalSignOutCommand({
          AccessToken: accessToken,
        });

        const cognitoClient = getCognitoClient();
        await cognitoClient.send(command);
      } catch (error) {
        // Log error but still clear cookies (fail gracefully)
        console.error('Global sign out error:', error);
      }
    }

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);

    // Even on error, clear cookies and return success
    const response = NextResponse.json({
      success: true,
      message: 'Logged out (cookies cleared)',
    });

    clearAuthCookies(response);
    return response;
  }
}
