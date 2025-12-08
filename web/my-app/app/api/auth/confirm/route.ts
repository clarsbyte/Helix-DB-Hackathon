import { NextRequest, NextResponse } from 'next/server';
import { ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { getCognitoClient, generateSecretHash, getCognitoConfig } from '@/lib/cognito';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    // Validate inputs
    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and confirmation code are required' },
        { status: 400 }
      );
    }

    // Get Cognito configuration
    const { clientId } = getCognitoConfig();

    // Generate SECRET_HASH
    const secretHash = generateSecretHash(email);

    // Create Cognito confirm sign up command
    const command = new ConfirmSignUpCommand({
      ClientId: clientId,
      SecretHash: secretHash,
      Username: email,
      ConfirmationCode: code,
    });

    // Execute confirmation
    const cognitoClient = getCognitoClient();
    await cognitoClient.send(command);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully. You can now sign in.',
    });
  } catch (error: any) {
    console.error('Confirmation error:', error);

    // Handle specific Cognito errors
    if (error.name === 'CodeMismatchException') {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code. Please try again.' },
        { status: 400 }
      );
    }

    if (error.name === 'ExpiredCodeException') {
      return NextResponse.json(
        { success: false, error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    if (error.name === 'NotAuthorizedException') {
      return NextResponse.json(
        { success: false, error: 'User is already confirmed or not found.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to confirm sign up' },
      { status: 500 }
    );
  }
}
