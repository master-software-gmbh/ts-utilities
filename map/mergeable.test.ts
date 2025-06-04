import { describe, it, expect } from 'bun:test';
import { merge } from './mergeable';

describe('mergeable', () => {
  it('should merge two records with the same keys', () => {
    const primary = { a: 1, b: 2, c: 3 };
    const secondary = { a: 4, b: 5, d: 4 };
    const expected = { a: 1, b: 2, c: 3, d: 4 };

    expect(merge(primary, secondary)).toEqual(expected);
  });

  it('should merge nested objects', () => {
    const primary = { a: { x: 1, y: 2 }, b: 2 };
    const secondary = { a: { x: 3 }, b: 5, c: 4 };
    const expected = { a: { x: 1, y: 2 }, b: 2, c: 4 };

    expect(merge(primary, secondary)).toEqual(expected);
  });

  it('should handle empty objects', () => {
    const primary = {};
    const secondary = { a: 1, b: 2 };
    const expected = { a: 1, b: 2 };

    expect(merge(primary, secondary)).toEqual(expected);
  });

  it('should return an empty object when both are empty', () => {
    const primary = {};
    const secondary = {};
    const expected = {};

    expect(merge(primary, secondary)).toEqual(expected);
  });

  it('should prioritize primary values over secondary', () => {
    const primary = { a: 1, b: 2 };
    const secondary = { a: 3, c: 4 };
    const expected = { a: 1, b: 2, c: 4 };

    expect(merge(primary, secondary)).toEqual(expected);
  });

  it('should handle boolean values correctly', () => {
    const primary = { a: true, b: false };
    const secondary = { a: false, c: true };
    const expected = { a: true, b: false, c: true };

    expect(merge(primary, secondary)).toEqual(expected);
  });

  it('should handle undefined values', () => {
    const primary = { a: 1, b: undefined };
    const secondary = { b: 2, c: 3 };
    const expected = { a: 1, b: undefined, c: 3 };

    // @ts-expect-error
    expect(merge(primary, secondary)).toEqual(expected);
  });
});
