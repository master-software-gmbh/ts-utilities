import '../array';

type Error<E> = { success: false; error: E; data?: undefined; message?: string };
type Success<D> = { success: true; data: D; error?: undefined; message?: string };

export type Result<D, E extends string> = Error<E> | Success<D>;

export function error<E extends string>(error: E, message?: string): Error<E> {
  return { success: false, error, message };
}

export function success<D extends undefined>(): Success<undefined>;
export function success<D>(data: D, message?: string): Success<D>;
export function success<D>(data?: D, message?: string): Success<D | undefined> {
  return { success: true, data, message };
}

export function successful<D, E extends string>(results: Result<D, E>[]): D[] {
  return results.compactMap((result) => {
    if (result.success) {
      return result.data;
    }

    return null;
  });
}

export async function fallback<D>(action: () => Promise<Result<D, string>>, fallback: D): Promise<D> {
  const result = await action();

  if (result.success) {
    return result.data;
  }

  return fallback;
}
