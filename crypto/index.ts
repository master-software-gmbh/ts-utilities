export * from './interface.d';
export * from './bun-crypto';
import crypto from 'node:crypto';
import type { NestedRecord, Primitive } from '../types';

export function hash(value: Primitive | NestedRecord): string {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  const sortedKeys = Object.keys(value).sort((a, b) => a.localeCompare(b));
  const resultingHash = crypto.createHash('sha256');

  for (const key of sortedKeys) {
    const localValue = value[key];

    if (localValue === undefined) {
      continue;
    }

    const hashedValue = hash(localValue);
    resultingHash.update(`${key}:${hashedValue}`);
  }

  return resultingHash.digest('hex');
}
