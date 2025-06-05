export * from './interface.d';
export * from './bun-crypto';
import crypto from 'node:crypto';
import type { NestedRecord, Primitive } from '../types';

export function hash(value: Primitive | NestedRecord): string {
  const resultingHash = crypto.createHash('sha256');

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    resultingHash.update(String(value));
  } else {
    const sortedKeys = Object.keys(value).sort((a, b) => a.localeCompare(b));

    for (const key of sortedKeys) {
      const localValue = value[key];

      if (localValue === undefined) {
        continue;
      }

      const hashedValue = hash(localValue);
      resultingHash.update(`${key}:${hashedValue}`);
    }
  }

  return resultingHash.digest('hex');
}
