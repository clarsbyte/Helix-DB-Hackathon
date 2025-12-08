import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import crypto from 'crypto';

// Singleton Cognito client instance
let cognitoClient: CognitoIdentityProviderClient | null = null;

/**
 * Get or create a Cognito Identity Provider client
 */
export function getCognitoClient(): CognitoIdentityProviderClient {
  if (!cognitoClient) {
    cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION || 'us-east-2',
    });
  }
  return cognitoClient;
}

/**
 * Generate SECRET_HASH required for Cognito operations with app client secret
 * Formula: HMAC_SHA256(username + clientId, clientSecret)
 *
 * @param username - The username (email in our case)
 * @returns Base64-encoded HMAC SHA256 hash
 */
export function generateSecretHash(username: string): string {
  const clientId = process.env.AWS_CLIENT_ID;
  const clientSecret = process.env.AWS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('AWS_CLIENT_ID and AWS_CLIENT_SECRET must be set in environment variables');
  }

  // Concatenate username and clientId
  const message = username + clientId;

  // Create HMAC SHA256 hash using client secret as key
  const hash = crypto
    .createHmac('sha256', clientSecret)
    .update(message)
    .digest('base64');

  return hash;
}

/**
 * Get environment variables with validation
 */
export function getCognitoConfig() {
  const userPoolId = process.env.AWS_USER_POOL_ID;
  const clientId = process.env.AWS_CLIENT_ID;
  const clientSecret = process.env.AWS_CLIENT_SECRET;
  const region = process.env.AWS_REGION || 'us-east-2';

  if (!userPoolId || !clientId || !clientSecret) {
    throw new Error(
      'Missing required environment variables: AWS_USER_POOL_ID, AWS_CLIENT_ID, AWS_CLIENT_SECRET'
    );
  }

  return {
    userPoolId,
    clientId,
    clientSecret,
    region,
  };
}
