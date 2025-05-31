import { describe, expect, it } from 'bun:test';
import './round';

describe('Math.round', () => {
  it('should round down', () => {
    expect(Math.round(45.1234)).toEqual(45);
  });

  it('should round up', () => {
    expect(Math.round(45.5234)).toEqual(46);
  });

  it('should round to two decimals', () => {
    expect(Math.round(45.1234, 2)).toEqual(45.12);
  });

  it('should round to two decimals', () => {
    expect(Math.round(45.567, 2)).toEqual(45.57);
  });

  it('should round to the nearest integer when no decimals are provided', () => {
    expect(Math.round(4.5)).toBe(5);
    expect(Math.round(4.4)).toBe(4);
  });

  it('should round to the specified number of decimals', () => {
    expect(Math.round(4.567, 2)).toBe(4.57);
    expect(Math.round(4.564, 2)).toBe(4.56);
  });

  it('should handle edge cases correctly', () => {
    expect(Math.round(-4.5)).toBe(-4);
    expect(Math.round(-4.567, 2)).toBe(-4.57);
  });

  it('should handle very large numbers', () => {
    expect(Math.round(123456789.9876543, 2)).toBe(123456789.99);
    expect(Math.round(-123456789.9876543, 2)).toBe(-123456789.99);
  });

  it('should handle very small numbers', () => {
    expect(Math.round(0.000123456, 6)).toBe(0.000123);
    expect(Math.round(-0.000123456, 6)).toBe(-0.000123);
  });

  it('should handle zero decimals explicitly', () => {
    expect(Math.round(4.5, 0)).toBe(5);
    expect(Math.round(4.4, 0)).toBe(4);
  });
});

describe('Math.floor', () => {
  it('should return the greatest integer less than or equal to the number when no decimals are provided', () => {
    expect(Math.floor(4.7)).toBe(4);
    expect(Math.floor(-4.7)).toBe(-5);
  });

  it('should floor to the specified number of decimals', () => {
    expect(Math.floor(4.567, 2)).toBe(4.56);
    expect(Math.floor(-4.567, 2)).toBe(-4.57);
  });

  it('should handle edge cases correctly', () => {
    expect(Math.floor(0, 2)).toBe(0);
    expect(Math.floor(-0.001, 3)).toBe(-0.001);
  });

  it('should floor', () => {
    expect(Math.floor(45.1234)).toEqual(45);
  });

  it('should floor', () => {
    expect(Math.floor(45.9234)).toEqual(45);
  });

  it('should floor to two decimals', () => {
    expect(Math.floor(45.1234, 2)).toEqual(45.12);
  });

  it('should floor to two decimals', () => {
    expect(Math.floor(45.567, 2)).toEqual(45.56);
  });

  it('should floor to two decimals', () => {
    expect(Math.floor(1452.5, -2)).toEqual(1400);
  });

  it('should floor to two decimals', () => {
    expect(Math.floor(14500, -2)).toEqual(14500);
  });

  it('should floor to two decimals', () => {
    expect(Math.floor(14501, -2)).toEqual(14500);
  });

  it('should floor to two decimals', () => {
    expect(Math.floor(4123, -3)).toEqual(4000);
  });

  it('should floor to two decimals', () => {
    expect(Math.floor(120981, -4)).toEqual(120000);
  });

  it('should floor to two decimals', () => {
    expect(Math.floor(123920981, -5)).toEqual(123900000);
  });

  it('should handle very large numbers', () => {
    expect(Math.floor(123456789.9876543, 2)).toBe(123456789.98);
    expect(Math.floor(-123456789.9876543, 2)).toBe(-123456789.99);
  });

  it('should handle very small numbers', () => {
    expect(Math.floor(0.000123456, 6)).toBe(0.000123);
    expect(Math.floor(-0.000123456, 6)).toBe(-0.000124);
  });

  it('should handle zero decimals explicitly', () => {
    expect(Math.floor(4.7, 0)).toBe(4);
    expect(Math.floor(-4.7, 0)).toBe(-5);
  });

  it('should handle negative decimals with large numbers', () => {
    expect(Math.floor(987654321, -3)).toBe(987654000);
    expect(Math.floor(-987654321, -3)).toBe(-987655000);
  });
});
