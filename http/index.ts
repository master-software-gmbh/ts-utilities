import type { StandardSchemaV1 } from '@standard-schema/spec';
import { logger } from '../logging';
import { type Result, error, success } from '../result';

/**
 * The maximum age of a cookie in seconds.
 * Chrome caps the expiration date to a maximum of 400 days.
 * @see https://developer.chrome.com/blog/cookie-max-age-expires
 */
export const MAX_COOKIE_AGE = 34560000;

export async function typedFetch<T, S extends StandardSchemaV1<unknown, T>>(
  url: string,
  init: RequestInit | undefined,
  decode: (response: Response) => Promise<unknown>,
  schema: S,
): Promise<Result<StandardSchemaV1.InferOutput<S>, 'request_failed' | 'decoding_failed' | 'parsing_failed'>> {
  const response = await fetch(url, init);

  if (!response.ok) {
    const responseText = await response.text();

    logger.warn('Fetch request failed', {
      url: url,
      status: response.status,
      text: responseText,
    });

    return error('request_failed');
  }

  let decodedData: unknown;

  try {
    decodedData = await decode(response);
  } catch (e) {
    logger.warn('Decoding of fetch response failed', {
      url: url,
      error: e,
    });

    return error('decoding_failed');
  }

  const parseResult = await schema['~standard'].validate(decodedData);

  if (parseResult.issues) {
    logger.warn('Parsing of fetch response failed', {
      url: url,
      issues: parseResult.issues,
    });

    return error('parsing_failed');
  }

  return success(parseResult.value);
}
