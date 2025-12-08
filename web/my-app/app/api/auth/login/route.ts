import { NextRequest, NextResponse } from 'next/server';
import { InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { getCognitoClient, generateSecretHash, getCognitoConfig } from '@/lib/cognito';
import { setAuthCookies } from '@/lib/auth-cookies';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get Cognito configuration
    const { clientId } = getCognitoConfig();

    // Generate SECRET_HASH
    const secretHash = generateSecretHash(email);

    // Create Cognito initiate auth command
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    });

    // Execute authentication
    const cognitoClient = getCognitoClient();
    const authResponse = await cognitoClient.send(command);

    // Check if authentication was successful
    if (!authResponse.AuthenticationResult) {
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 401 }
      );
    }

    const {
      IdToken,
      AccessToken,
      RefreshToken,
    } = authResponse.AuthenticationResult;

    if (!IdToken || !AccessToken || !RefreshToken) {
      return NextResponse.json(
        { success: false, error: 'Missing authentication tokens' },
        { status: 500 }
      );
    }

    // Decode the ID token to get user information (basic parsing)
    // In production, you might want to verify the JWT signature
    const idTokenPayload = JSON.parse(
      Buffer.from(IdToken.split('.')[1], 'base64').toString()
    );

    const user = {
      username: idTokenPayload['cognito:username'],
      email: idTokenPayload.email,
      userId: idTokenPayload.sub,
      name: idTokenPayload.name,
    };

    // Create response
    const response = NextResponse.json({
      success: true,
      user,
      message: 'Login successful',
    });

    // Set HTTP-only cookies with tokens
    setAuthCookies(response, {
      IdToken,
      AccessToken,
      RefreshToken,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);

    // Handle specific Cognito errors
    if (error.name === 'NotAuthorizedException') {
      return NextResponse.json(
        { success: false, error: 'Incorrect email or password' },
        { status: 401 }
      );
    }

    if (error.name === 'UserNotConfirmedException') {
      return NextResponse.json(
        { success: false, error: 'Please verify your email before logging in' },
        { status: 401 }
      );
    }

    if (error.name === 'UserNotFoundException') {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (error.name === 'InvalidParameterException') {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sign in' },
      { status: 500 }
    );
  }
}
