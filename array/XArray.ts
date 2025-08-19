export class XArray<T> extends Array<T> {
  /**
   * Splits the array into slices of the specified size.
   */
  static *slices<T>(array: T[], size: number): IterableIterator<T[]> {
    for (let i = 0; i < array.length; i += size) {
      yield array.slice(i, i + size);
    }
  }

  /**
   * Splits the array into slices of the specified size.
   */
  *slices (size: number): IterableIterator<T[]> {
    for (let i = 0; i < this.length; i += size) {
      yield this.slice(i, i + size);
    }
  }
}
