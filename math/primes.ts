import { Range } from './range';

export function isPrime(value: number): boolean {
  if (value < 2) {
    return false;
  }

  const end = Math.floor(Math.sqrt(value));

  for (let i = 2; i <= end; i++) {
    if (value % i === 0) {
      return false;
    }
  }

  return true;
}

export function primeSequence(max: number): number[] {
  return new Range(1, max).sequence().filter((i) => isPrime(i));
}

export function primeFactors(value: number): number[] {
  if (isPrime(value)) {
    return [value];
  }

  if (value === 1) {
    return [];
  }

  let i = 2;

  for (i; i <= value && isPrime(i) && value % i !== 0; i++) {}

  return [i, ...primeFactors(value / i)];
}
