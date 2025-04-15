import { describe, expect, it } from 'bun:test';
import { Fraction } from './fractions';

describe('Fractions', () => {
  it('should reduce', () => {
    expect(new Fraction(10, 5).reduced().compareTo(new Fraction(2, 1))).toEqual(0);
    expect(new Fraction(16, 2).reduced().compareTo(new Fraction(8, 1))).toEqual(0);
    expect(new Fraction(27, 6).reduced().compareTo(new Fraction(9, 2))).toEqual(0);
    expect(new Fraction(41, 6).reduced().compareTo(new Fraction(41, 6))).toEqual(0);
    expect(new Fraction(42, 6).reduced().compareTo(new Fraction(7, 1))).toEqual(0);
    expect(new Fraction(78, 104).reduced().compareTo(new Fraction(3, 4))).toEqual(0);
    expect(new Fraction(78, 104).compareTo(new Fraction(3, 4))).toEqual(0);
  });
});
