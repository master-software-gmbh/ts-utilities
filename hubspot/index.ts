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
