import { Fraction } from './fractions';
import '../array';

export function calculateMean(sample: { value: number; occurrences: number }[]): number {
  const totalOccurrences = sample.sum('occurrences');

  return calculateWeightedMean(
    sample.map((unit) => ({
      value: unit.value,
      weight: new Fraction(unit.occurrences, totalOccurrences),
    })),
  );
}

export function calculateWeightedMean(sample: { value: number; weight: Fraction }[]): number {
  return sample.reduce((previous, next) => {
    return previous + next.weight.multiplyWith(next.value);
  }, 0);
}
