import { describe, it, expect } from 'bun:test';
import { XArray } from './XArray';

describe('XArray', () => {
  describe('slices', () => {
    it('should return an empty iterator for an empty array', () => {
      const result = new XArray([]).slices(2);
      expect([...result]).toEqual([]);
    });

    it('should return slices of the specified size', () => {
      const result = new XArray([1, 2, 3, 4, 5]).slices(2);
      expect([...result]).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should return slices of the specified size with a larger slice size', () => {
      const result = new XArray([1, 2, 3, 4, 5]).slices(3);
      expect([...result]).toEqual([
        [1, 2, 3],
        [4, 5],
      ]);
    });

    it('should return slices of the specified size with a slice size equal to the array length', () => {
      const result = new XArray([1, 2, 3]).slices(3);
      expect([...result]).toEqual([[1, 2, 3]]);
    });
  });

  describe('compactMap', () => {
    it('should filter out null and undefined', () => {
      const expected = [1, 2, 3, 4];
      const result = new XArray([1, 2, 3, null, 4, undefined]).compactMap((e) => e);

      expect(result).toEqual(expected);
    });

    it('should filter out null and undefined with custom transform', () => {
      const expected = [2, 4];
      const result = new XArray([1, 2, 3, 4]).compactMap((e) => (e % 2 === 0 ? e : null));

      expect(result).toEqual(expected);
    });

    it('should filter out null and undefined with custom transform', () => {
      const expected = [5, 'test'];
      const result = new XArray([{ value: null }, { value: 5 }, { value: 'test' }, { value: null }]).compactMap((e) => e.value);

      expect(result).toEqual(expected);
    });
  });

  describe('joinDefined', () => {
    it('should skip null or undefined values', () => {
      const array = new XArray([null, 'abc', 'def', undefined]);
      expect(array.joinDefined()).toEqual('abc def');
    });
    
    it('should use a custom separator', () => {
      const array = new XArray([null, 'abc', 'def', undefined]);
      expect(array.joinDefined(', ')).toEqual('abc, def');
    });
  });
});
