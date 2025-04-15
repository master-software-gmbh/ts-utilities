import { describe, expect, it } from 'bun:test';
import { calculateMean } from './mean';

describe('Arithmetic Mean', () => {
  it('should calculate mean', () => {
    expect(
      calculateMean([
        {
          value: 5,
          occurrences: 5,
        },
      ]),
    ).toEqual(5);

    expect(
      calculateMean([
        {
          value: 5,
          occurrences: 5,
        },
        {
          value: 5,
          occurrences: 5,
        },
      ]),
    ).toEqual(5);

    expect(
      calculateMean([
        {
          value: 5,
          occurrences: 5,
        },
        {
          value: 3,
          occurrences: 5,
        },
      ]),
    ).toEqual(4);

    expect(
      calculateMean([
        {
          value: 5,
          occurrences: 5,
        },
        {
          value: 3,
          occurrences: 3,
        },
      ]),
    ).toEqual(4.25);
  });
});
