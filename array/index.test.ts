import { describe, expect, it } from 'bun:test';
import './index';

describe('array', () => {
  describe('compactMap', () => {
    it('should filter out null and undefined', () => {
      const input = [1, 2, 3, null, 4, undefined];
      const expected = [1, 2, 3, 4];
      const result = input.compactMap();

      expect(result).toEqual(expected);
    });

    it('should filter out null and undefined with custom transform', () => {
      const input = [1, 2, 3, 4];
      const expected = [2, 4];
      const result = input.compactMap((e) => (e % 2 === 0 ? e : null));

      expect(result).toEqual(expected);
    });

    it('should filter out null and undefined with custom transform', () => {
      const input = [{ value: null }, { value: 5 }, { value: 'test' }, { value: null }];
      const expected = [5, 'test'];
      const result = input.compactMap((e) => e.value);

      expect(result).toEqual(expected);
    });
  });

  describe('sum', () => {
    it('should return zero for an empty array', () => {
      const input: { amount: number }[] = [];
      const result = input.sum('amount');
      expect(result).toEqual(0);
    });

    it('should return the sum for an array', () => {
      const input: { name: string; amount: number }[] = [
        {
          name: 'A',
          amount: 5,
        },
        {
          name: 'B',
          amount: 0,
        },
        {
          name: 'C',
          amount: 3,
        },
        {
          name: 'D',
          amount: -2,
        },
      ];

      const result = input.sum('amount');
      expect(result).toEqual(6);
    });
  });

  describe('max', () => {
    it('should return null when array is empty', () => {
      const result = [].max();

      expect(result).toEqual(null);
    });

    it('should return the maximum', () => {
      const result = [1].max();

      expect(result).toEqual(1);
    });

    it('should return the maximum', () => {
      const result = [1, 2, 3].max();

      expect(result).toEqual(3);
    });

    it('should return the maximum', () => {
      const result = [1, 3, 2].max();

      expect(result).toEqual(3);
    });

    it('should return the maximum', () => {
      const result = [5, 5, 5, 5].max();

      expect(result).toEqual(5);
    });

    it('should return the maximum', () => {
      const result = [10, 2, 31].max();

      expect(result).toEqual(31);
    });
  });

  describe('product', () => {
    it('should return null for an empty array', () => {
      const result = [].product();

      expect(result).toBeUndefined();
    });

    it('should return the product', () => {
      const result = [1].product();

      expect(result).toEqual(1);
    });

    it('should return the product', () => {
      const result = [1, 2, 3].product();

      expect(result).toEqual(6);
    });

    it('should return the product', () => {
      const result = [1, 3, 2].product();

      expect(result).toEqual(6);
    });

    it('should return the product', () => {
      const result = [5, 5, 5, 5].product();

      expect(result).toEqual(625);
    });

    it('should return the product', () => {
      const result = [10, 2, 31].product();

      expect(result).toEqual(620);
    });
  });

  describe('slices', () => {
    it('should return an empty iterator for an empty array', () => {
      const result = [].slices(2);
      expect([...result]).toEqual([]);
    });

    it('should return slices of the specified size', () => {
      const result = [1, 2, 3, 4, 5].slices(2);
      expect([...result]).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should return slices of the specified size with a larger slice size', () => {
      const result = [1, 2, 3, 4, 5].slices(3);
      expect([...result]).toEqual([[1, 2, 3], [4, 5]]);
    });

    it('should return slices of the specified size with a slice size equal to the array length', () => {
      const result = [1, 2, 3].slices(3);
      expect([...result]).toEqual([[1, 2, 3]]);
    });
  })
});
