import { createHmac } from 'node:crypto';
import { z } from 'zod';

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

export const User = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  display_name: z.string(),
  email: z.string(),
  type: z.number(),
  role_name: z.string(),
  pmi: z.number(),
  use_pmi: z.boolean(),
  personal_meeting_url: z.string(),
  timezone: z.string(),
  verified: z.number(),
  dept: z.string(),
  created_at: z.string(),
  last_login_time: z.string(),
  cms_user_id: z.string(),
  jid: z.string(),
  group_ids: z.array(z.string()),
  im_group_ids: z.array(z.string()),
  account_id: z.string(),
  language: z.string(),
  phone_country: z.string(),
  phone_number: z.string(),
  status: z.string(),
  job_title: z.string(),
  cost_center: z.string(),
  company: z.string(),
  location: z.string(),
  login_types: z.array(z.number()),
  role_id: z.string(),
  cluster: z.string(),
  user_created_at: z.string(),
});

export type User = z.infer<typeof User>;
