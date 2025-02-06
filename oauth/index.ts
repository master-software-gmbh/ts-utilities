import { z } from 'zod';

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
 * @returns access token response or an error message
 */
export async function refreshAccessToken(
  endpoint: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  refreshToken: string,
) {
  return makeAccessTokenRequest(endpoint, clientId, clientSecret, {
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
 * @returns access token response or an error message
 */
export async function requestAccessToken(
  endpoint: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  authorizationCode: string,
) {
  return makeAccessTokenRequest(endpoint, clientId, clientSecret, {
    code: authorizationCode,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });
}

async function makeAccessTokenRequest(
  endpoint: string,
  clientId: string,
  clientSecret: string,
  body: Record<string, string>,
): Promise<
  | {
      code: 'success';
      data: AccessTokenResponse;
    }
  | {
      code: 'unexpected_status_code';
      text: string;
    }
  | {
      code: 'unexpected_response_encoding';
      message: string;
    }
  | {
      code: 'unexpected_response_format';
      message: string;
    }
> {
  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = Buffer.from(credentials).toString('base64');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body),
  });

  if (!response.ok) {
    return {
      code: 'unexpected_status_code',
      text: await response.text(),
    };
  }

  let jsonData: unknown;

  try {
    jsonData = await response.json();
  } catch (error) {
    return {
      code: 'unexpected_response_encoding',
      message: JSON.stringify(error),
    };
  }

  const parseResult = AccessTokenResponse.safeParse(jsonData);

  if (parseResult.error) {
    return {
      code: 'unexpected_response_format',
      message: parseResult.error.message,
    };
  }

  return {
    code: 'success',
    data: parseResult.data,
  };
}
