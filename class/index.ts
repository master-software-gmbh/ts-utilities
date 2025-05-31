export type Constructor<T> = new (...args: any[]) => T;

export function ofInstance<E, F extends E>(array: E[], ...filterType: Constructor<F>[]): F[] {
  return array.filter((e) => filterType.some((type) => e instanceof type)) as F[];
}
