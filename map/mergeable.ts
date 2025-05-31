export class Mergeable<T> {
  merge(other: Partial<T> = {}): this {
    return { ...this, ...other };
  }
}
