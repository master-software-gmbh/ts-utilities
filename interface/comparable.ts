export interface Comparable<T> {
  /**
   * Compares this to other.
   * @returns 0 if this and other are equal
   */
  compareTo(other: T): number;
}
