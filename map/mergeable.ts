import type { NestedRecord } from '../types';

export function merge(primary: NestedRecord, secondary: NestedRecord) {
  const result: NestedRecord = {};

  for (const key of Object.keys(primary)) {
    const primaryValue = primary[key];
    const secondaryValue = secondary[key];

    if (key in secondary) {
      if (typeof primaryValue === 'object' && typeof secondaryValue === 'object') {
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

  return result;
}

export class Mergeable<T> {
  merge(other: Partial<T> = {}): this {
    return { ...this, ...other };
  }
}
