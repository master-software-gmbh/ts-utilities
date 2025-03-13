import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * The maximum age of a cookie in seconds.
 * Chrome caps the expiration date to a maximum of 400 days.
 * @see https://developer.chrome.com/blog/cookie-max-age-expires
 */
export const MAX_COOKIE_AGE = 34560000;

export async function typedFetch<T, S extends StandardSchemaV1<unknown, T>>(
  input: string | URL | Request,
  init: RequestInit | undefined,
  decode: (response: Response) => Promise<unknown>,
  schema: S,
): Promise<
  | {
      code: 'success';
      data: StandardSchemaV1.InferOutput<S>;
    }
  | {
      code: 'request_failed';
      message: string;
    }
  | {
      code: 'decoding_failed';
      message: string;
    }
  | {
      code: 'parsing_failed';
      issues: Readonly<StandardSchemaV1.Issue[]>;
    }
> {
  const response = await fetch(input, init);

  if (!response.ok) {
    return {
      code: 'request_failed',
      message: await response.text(),
    };
  }

  let decodedData: unknown;

  try {
    decodedData = await decode(response);
  } catch (error) {
    return {
      code: 'decoding_failed',
      message: JSON.stringify(error),
    };
  }

  const parseResult = await schema["~standard"].validate(decodedData);

  if (parseResult.issues) {
    return {
      code: 'parsing_failed',
      issues: parseResult.issues,
    };
  }

  return {
    code: 'success',
    data: parseResult.value,
  };
}
