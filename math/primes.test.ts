import { describe, expect, it } from 'bun:test';
import { isPrime, primeFactors } from './primes';

describe('Primes', () => {
  it('should calculate prime numbers', () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(3)).toBe(true);
    expect(isPrime(5)).toBe(true);
    expect(isPrime(7)).toBe(true);
    expect(isPrime(11)).toBe(true);
    expect(isPrime(13)).toBe(true);

    expect(isPrime(-5)).toBe(false);
    expect(isPrime(0)).toBe(false);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(4)).toBe(false);
    expect(isPrime(6)).toBe(false);
    expect(isPrime(8)).toBe(false);
    expect(isPrime(9)).toBe(false);
    expect(isPrime(10)).toBe(false);

    expect(primeFactors(30)).toEqual([2, 3, 5]);
    expect(primeFactors(31)).toEqual([31]);
    expect(primeFactors(97)).toEqual([97]);
    expect(primeFactors(88)).toEqual([2, 2, 2, 11]);
    expect(primeFactors(27)).toEqual([3, 3, 3]);
    expect(primeFactors(1)).toEqual([]);
  });
});
