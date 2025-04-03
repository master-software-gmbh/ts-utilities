import { describe, expect, it } from 'bun:test';
import './index';

describe('toISODateString', () => {
  it('should convert a date to ISO date string', () => {
    expect(new Date(2025, 3, 3).toISODateString()).toBe('2025-04-03');
    expect(new Date(2022, 0, 1).toISODateString()).toBe('2022-01-01');
    expect(new Date(2030, 11, 31).toISODateString()).toBe('2030-12-31');
  });
});
