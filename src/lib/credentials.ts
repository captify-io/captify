import { CognitoIdentityClient, GetIdCommand, GetCredentialsForIdentityCommand } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const IDENTITY_POOL_ID = process.env.COGNITO_IDENTITY_POOL_ID!;
const REGION = process.env.AWS_REGION || 'us-east-1';

export interface AwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration?: Date;
}

/**
 * Get AWS credentials from Cognito Identity Pool using ID token
 */
export async function getAwsCredentialsFromIdentityPool(
  idToken: string,
  identityPoolId?: string
): Promise<AwsCredentials> {
  const poolId = identityPoolId || IDENTITY_POOL_ID;

  if (!poolId) {
    throw new Error('Identity Pool ID not configured');
  }

  // Extract issuer from ID token (JWT)
  const tokenParts = idToken.split('.');
  if (tokenParts.length !== 3) {
    throw new Error('Invalid ID token format');
  }

  const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
  const issuer = payload.iss;

  if (!issuer) {
    throw new Error('ID token missing issuer claim');
  }

  // Convert issuer URL to provider name format
  // Issuer: https://cognito-idp.us-east-1.amazonaws.com/us-east-1_bZwSNAzU9
  // Provider: cognito-idp.us-east-1.amazonaws.com/us-east-1_bZwSNAzU9
  const providerName = issuer.replace('https://', '');

  const client = new CognitoIdentityClient({ region: REGION });

  // Get Identity ID
  const getIdCommand = new GetIdCommand({
    IdentityPoolId: poolId,
    Logins: {
      [providerName]: idToken,
    },
  });

  const { IdentityId } = await client.send(getIdCommand);

  if (!IdentityId) {
    throw new Error('Failed to get Identity ID from Cognito');
  }

  // Get credentials for identity
  const getCredentialsCommand = new GetCredentialsForIdentityCommand({
    IdentityId,
    Logins: {
      [providerName]: idToken,
    },
  });

  const { Credentials } = await client.send(getCredentialsCommand);

  if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretKey || !Credentials.SessionToken) {
    throw new Error('Failed to get credentials from Cognito');
  }

  return {
    accessKeyId: Credentials.AccessKeyId,
    secretAccessKey: Credentials.SecretKey,
    sessionToken: Credentials.SessionToken,
    expiration: Credentials.Expiration,
  };
}
