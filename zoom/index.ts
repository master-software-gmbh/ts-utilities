import { createHmac } from 'node:crypto';

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
