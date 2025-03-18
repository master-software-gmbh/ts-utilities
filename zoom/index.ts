import { createHmac } from 'node:crypto';
import { type InferOutput, array, boolean, number, object, optional, string } from 'valibot';

/**
 * Validates the request signature.
 * @param body raw request body
 * @param secret webhook secret
 * @param header function to get a header
 * @returns true if the signature is valid or an error message
 */
export function validateWebhookRequest(
  body: string,
  secret: string,
  header: (name: string) => string | undefined,
): true | 'missing_timestamp' | 'missing_signature' | 'invalid_signature' {
  const timestamp = header('x-zm-request-timestamp');

  if (!timestamp) {
    return 'missing_timestamp';
  }

  const signature = header('x-zm-signature');

  if (!signature) {
    return 'missing_signature';
  }

  const actualSignature = signWebhookRequest(body, timestamp, secret);

  if (signature !== actualSignature) {
    return 'invalid_signature';
  }

  return true;
}

/**
 * Creates an encrypted request signature.
 * @param body raw request body
 * @param timestamp request timestamp
 * @param secret webhook secret
 * @returns signature
 */
export function signWebhookRequest(body: string, timestamp: string, secret: string): string {
  return `v0=${hashPayload(`v0:${timestamp}:${body}`, secret)}`;
}

/**
 * Creates a hex-encoded hash of the payload.
 * @param payload payload
 * @param secret hash secret
 * @returns hash
 */
export function hashPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export const OAuthEndpoint = {
  Authorization: 'https://zoom.us/oauth/authorize',
  AccessToken: 'https://zoom.us/oauth/token',
};

export function getOAuthAuthorizationUrl(clientId: string, redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
  });

  return `${OAuthEndpoint.Authorization}?${params.toString()}`;
}

export const User = object({
  id: string(),
  dept: optional(string()),
  email: string(),
  first_name: string(),
  last_login_time: string(),
  last_name: string(),
  pmi: number(),
  role_name: string(),
  timezone: string(),
  type: number(),
  use_pmi: boolean(),
  display_name: string(),
  account_id: string(),
  cms_user_id: string(),
  company: optional(string()),
  user_created_at: string(),
  group_ids: array(string()),
  im_group_ids: array(string()),
  jid: string(),
  job_title: string(),
  language: string(),
  location: string(),
  login_types: array(number()),
  personal_meeting_url: string(),
  phone_numbers: optional(
    array(
      object({
        code: optional(string()),
        country: optional(string()),
        label: optional(string()),
        number: optional(string()),
        verified: optional(boolean()),
      }),
    ),
  ),
  verified: number(),
  status: string(),
  cost_center: string(),
  role_id: string(),
  cluster: string(),
});

export type User = InferOutput<typeof User>;
