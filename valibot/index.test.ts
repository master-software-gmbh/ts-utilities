import { describe, expect, it } from 'bun:test';
import { parse } from 'valibot';
import { booleanString } from '.';

describe('booleanString', () => {
  it('should transform "true" to true', () => {
    const result = parse(booleanString(), 'true');
    expect(result).toBe(true);
  });

  it('should transform "false" to false', () => {
    const result = parse(booleanString(), 'false');
    expect(result).toBe(false);
  });

  it('should transform "abc" to false', () => {
    const result = parse(booleanString(), 'abc');
    expect(result).toBe(false);
  });

  it('should transform "true" to true', () => {
    const result = parse(booleanString(false), 'true');
    expect(result).toBe(true);
  });

  it('should transform "false" to false', () => {
    const result = parse(booleanString(true), 'false');
    expect(result).toBe(false);
  });

  it('should transform "false" to false', () => {
    const result = parse(booleanString(false), 'false');
    expect(result).toBe(false);
  });

  it('should use fallback', () => {
    const result = parse(booleanString(true), undefined);
    expect(result).toBe(true);
  });

  it('should use fallback', () => {
    const result = parse(booleanString(false), undefined);
    expect(result).toBe(false);
  });
});
