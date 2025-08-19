import { describe, it, expect } from 'bun:test';
import { XArray } from './XArray';

describe('XArray', () => {
  describe('slices', () => {
    it('should return an empty iterator for an empty array', () => {
      const result = XArray.slices([], 2);
      expect([...result]).toEqual([]);
    });

    it('should return slices of the specified size', () => {
      const result = XArray.slices([1, 2, 3, 4, 5], 2);
      expect([...result]).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should return slices of the specified size with a larger slice size', () => {
      const result = XArray.slices([1, 2, 3, 4, 5], 3);
      expect([...result]).toEqual([
        [1, 2, 3],
        [4, 5],
      ]);
    });

    it('should return slices of the specified size with a slice size equal to the array length', () => {
      const result = XArray.slices([1, 2, 3], 3);
      expect([...result]).toEqual([[1, 2, 3]]);
    });
  });
})