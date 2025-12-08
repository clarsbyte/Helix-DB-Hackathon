import { NextRequest, NextResponse } from 'next/server';
import { GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { getCognitoClient } from '@/lib/cognito';
import { getTokenFromCookie } from '@/lib/auth-cookies';

export async function GET(request: NextRequest) {
  try {
    // Extract access token from cookies
    const accessToken = getTokenFromCookie(request, 'accessToken');

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Create Get User command
    const command = new GetUserCommand({
      AccessToken: accessToken,
    });

    // Execute get user
    const cognitoClient = getCognitoClient();
    const userResponse = await cognitoClient.send(command);

    // Extract user attributes
    const attributes: Record<string, string> = {};
    userResponse.UserAttributes?.forEach((attr) => {
      if (attr.Name && attr.Value) {
        attributes[attr.Name] = attr.Value;
      }
    });

    const user = {
      username: userResponse.Username,
      email: attributes.email,
      userId: attributes.sub,
      name: attributes.name,
    };

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    // Handle specific Cognito errors
    if (error.name === 'NotAuthorizedException') {
      // Don't log this - it's expected when user is not authenticated
      return NextResponse.json(
        { success: false, error: 'Token expired or invalid' },
        { status: 401 }
      );
    }

    // Log unexpected errors
    console.error('Get user error:', error);

    if (error.name === 'UserNotFoundException') {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get user' },
      { status: 500 }
    );
  }
}
