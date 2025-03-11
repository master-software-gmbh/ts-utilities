export type Result<T, E extends string> = { success: true; data: T } | { success: false; error: E };

export function error<T extends string>(error: T): Result<never, T> {
  return { success: false, error };
}

export function success<T>(data: T): Result<T, never> {
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
