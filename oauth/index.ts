import { z } from 'zod';
import { typedFetch } from '../http';

export const AccessTokenResponse = z.object({
  access_token: z.string(),
  token_type: z.enum(['bearer', 'Bearer']),
  refresh_token: z.string(),
  expires_in: z.number().optional().describe('Token expiration time in seconds'),
  scope: z.string().optional(),
});

export type AccessTokenResponse = z.infer<typeof AccessTokenResponse>;

/**
 * Exchanges the refresh token for an access token.
 * @param endpoint access token endpoint
 * @param clientId client id
 * @param clientSecret client secret
 * @param redirectUri redirect uri
 * @param refreshToken refresh token
 * @param method authentication method
 * @returns access token response or an error message
 */
export async function refreshAccessToken(
  endpoint: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  refreshToken: string,
  method: 'basic' | 'body',
) {
  return makeAuthenticatedRequest(endpoint, method, {
    clientId,
    clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    redirect_uri: redirectUri,
  });
}

/**
 * Exchanges the authorization code for an access token.
 * @param endpoint access token endpoint
 * @param clientId client id
 * @param clientSecret client secret
 * @param redirectUri redirect uri
 * @param authorizationCode authorization code
 * @param method authentication method
 * @returns access token response or an error message
 */
export async function requestAccessToken(
  endpoint: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  authorizationCode: string,
  method: 'basic' | 'body',
) {
  return makeAuthenticatedRequest(endpoint, method, {
    clientId,
    clientSecret,
    code: authorizationCode,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });
}

async function makeAuthenticatedRequest(
  endpoint: string,
  method: 'basic' | 'body',
  data: { clientId: string; clientSecret: string } & Record<string, string>,
) {
  switch (method) {
    case 'basic': {
      const { clientId, clientSecret, ...body } = data;
      const credentials = `${clientId}:${clientSecret}`;
      const encodedCredentials = Buffer.from(credentials).toString('base64');

      return makeFormRequest(endpoint, body, {
        Authorization: `Basic ${encodedCredentials}`,
      });
    }

    case 'body':
      return makeFormRequest(endpoint, data);
  }
}

async function makeFormRequest(endpoint: string, body: Record<string, string>, headers?: Record<string, string>) {
  return typedFetch(
    endpoint,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...headers,
      },
      body: new URLSearchParams(body),
    },
    (response) => response.json(),
    AccessTokenResponse,
  );
}
