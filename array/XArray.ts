export class XArray<T> {
  private readonly array: Array<T>;

  constructor(array: Array<T>) {
    this.array = array;
  }

  /**
   * Transforms the elements of the array using the provided transform function and filters out any `null` or `undefined` values from the result.
   */
  compactMap<U = Exclude<T, null | undefined>>(transform: (element: T) => U | null | undefined): U[] {
    return this.array.reduce<U[]>((acc, element) => {
      const result = transform(element);
  
      if (result !== null && result !== undefined) {
        acc.push(result);
      }
  
      return acc;
    }, []);
  }

  /**
   * Splits the array into slices of the specified size.
   */
  *slices (size: number): IterableIterator<T[]> {
    for (let i = 0; i < this.array.length; i += size) {
      yield this.array.slice(i, i + size);
    }
  }
}
