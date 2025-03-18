import { type InferOutput, array, number, object, string } from 'valibot';

export const OAuthEndpoint = {
  Authorization: 'https://app.hubspot.com/oauth/authorize',
  AccessToken: 'https://api.hubapi.com/oauth/v1/token',
};

export function getOAuthAuthorizationUrl(
  clientId: string,
  scope: string,
  redirectUri: string,
  optionalScope?: string,
  state?: string,
): string {
  const params = new URLSearchParams({
    scope: scope,
    client_id: clientId,
    redirect_uri: redirectUri,
  });

  if (optionalScope) {
    params.append('optional_scope', optionalScope);
  }

  if (state) {
    params.append('state', state);
  }

  return `${OAuthEndpoint.Authorization}?${params.toString()}`;
}

export const AccessTokenMetadata = object({
  token: string(),
  user: string(),
  hub_domain: string(),
  scopes: array(string()),
  token_type: string(),
  expires_in: number(),
  hub_id: number(),
  app_id: number(),
  user_id: number(),
});

export type AccessTokenMetadata = InferOutput<typeof AccessTokenMetadata>;
