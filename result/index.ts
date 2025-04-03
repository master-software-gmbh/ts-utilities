import '../array';

export type Result<T, E extends string> =
  | { success: true; data: T; error?: undefined }
  | { success: false; error: E; data?: undefined };

export function error<T extends string>(error: T): Result<never, T> {
  return { success: false, error };
}

export function success<T extends undefined>(): Result<undefined, never>;
export function success<T>(data: T): Result<T, never>;
export function success<T>(data?: T): Result<T | undefined, never> {
  return { success: true, data };
}

export function successful<T, E extends string>(results: Result<T, E>[]): T[] {
  return results.compactMap((result) => {
    if (result.success) {
      return result.data;
    }

    return null;
  });
}

export async function fallback<T>(action: () => Promise<Result<T, string>>, fallback: T): Promise<T> {
  const result = await action();

  if (result.success) {
    return result.data;
  }

  return fallback;
}
