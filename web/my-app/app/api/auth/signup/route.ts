import { NextRequest, NextResponse } from 'next/server';
import { SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { getCognitoClient, generateSecretHash, getCognitoConfig } from '@/lib/cognito';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Get Cognito configuration
    const { userPoolId, clientId } = getCognitoConfig();

    // Generate SECRET_HASH
    const secretHash = generateSecretHash(email);

    // Prepare user attributes
    const userAttributes = [
      {
        Name: 'email',
        Value: email,
      },
    ];

    if (name) {
      userAttributes.push({
        Name: 'name',
        Value: name,
      });
    }

    // Create Cognito sign up command
    const command = new SignUpCommand({
      ClientId: clientId,
      SecretHash: secretHash,
      Username: email,
      Password: password,
      UserAttributes: userAttributes,
    });

    // Execute sign up
    const cognitoClient = getCognitoClient();
    const response = await cognitoClient.send(command);

    return NextResponse.json({
      success: true,
      needsConfirmation: true,
      userId: response.UserSub,
      message: 'Sign up successful. Please check your email for verification code.',
    });
  } catch (error: any) {
    console.error('Sign up error:', error);

    // Handle specific Cognito errors
    if (error.name === 'UsernameExistsException') {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    if (error.name === 'InvalidPasswordException') {
      return NextResponse.json(
        { success: false, error: 'Password does not meet requirements' },
        { status: 400 }
      );
    }

    if (error.name === 'InvalidParameterException') {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sign up' },
      { status: 500 }
    );
  }
}
