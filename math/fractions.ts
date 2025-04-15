import type { Comparable } from '../interface/comparable';
import type { Describable } from '../interface/describable';
import { primeFactors } from './primes';
import '../array';

export class Fraction implements Describable, Comparable<Fraction> {
  numerator: number;
  denominator: number;

  constructor(numerator: number, denominator: number) {
    this.numerator = numerator;
    this.denominator = denominator;
  }

  multiplyWith(number: number): number;
  multiplyWith(fraction: Fraction): Fraction;
  multiplyWith(value: number | Fraction): number | Fraction {
    if (value instanceof Fraction) {
      return new Fraction(this.numerator * value.numerator, this.denominator * value.denominator);
    }

    return (value * this.numerator) / this.denominator;
  }

  reduced(): Fraction {
    if (this.numerator % this.denominator === 0) {
      return new Fraction(this.numerator / this.denominator, 1);
    }

    // Find largest common denominator of numerator and denominator

    const numeratorPrimeFactors = primeFactors(this.numerator);
    const denominatorPrimeFactors = primeFactors(this.denominator);

    const commonPrimeFactors: number[] = [];

    for (const factor of numeratorPrimeFactors) {
      const indexOfFactorInDenominatorFactors = denominatorPrimeFactors.indexOf(factor);

      if (indexOfFactorInDenominatorFactors > -1) {
        commonPrimeFactors.push(factor);
        denominatorPrimeFactors.splice(indexOfFactorInDenominatorFactors, 1);
      }
    }

    const largestCommonFactor = commonPrimeFactors.product();

    if (largestCommonFactor) {
      return new Fraction(this.numerator / largestCommonFactor, this.denominator / largestCommonFactor);
    }

    return new Fraction(this.numerator, this.denominator);
  }

  description(): string {
    return `${this.numerator} / ${this.denominator}`;
  }

  compareTo(other: Fraction): number {
    const thisReduced = this.reduced();
    const otherReduced = other.reduced();

    if (thisReduced.numerator === otherReduced.numerator && thisReduced.denominator === otherReduced.denominator) {
      return 0;
    }

    return -1;
  }
}
