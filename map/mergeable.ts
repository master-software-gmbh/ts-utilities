import type { NestedRecord } from '../types';

type Merge<P, S> = {
  [K in keyof (P & S)]: K extends keyof S ? S[K] : K extends keyof P ? P[K] : never;
};

/**
 * Merges two records, prioritizing values from the primary record.
 */
export function merge<P extends NestedRecord, S extends NestedRecord>(primary: P, secondary: S) {
  const result: NestedRecord = {};

  for (const key of Object.keys(primary)) {
    const primaryValue = primary[key];
    const secondaryValue = secondary[key];

    if (key in secondary) {
      if (
        typeof primaryValue === 'object' &&
        primaryValue !== null &&
        typeof secondaryValue === 'object' &&
        secondaryValue !== null
      ) {
        result[key] = merge(primaryValue, secondaryValue);
      } else if (primaryValue !== undefined) {
        result[key] = primaryValue;
      }
    } else if (primaryValue !== undefined) {
      result[key] = primaryValue;
    }
  }

  for (const key of Object.keys(secondary)) {
    const secondaryValue = secondary[key];

    if (!(key in primary) && secondaryValue !== undefined) {
      result[key] = secondaryValue;
    }
  }

  return result as Merge<P, S>;
}

export class Mergeable<T> {
  merge(other: Partial<T> = {}): this {
    return { ...this, ...other };
  }
}
