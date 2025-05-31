import { describe, expect, it } from 'bun:test';
import { parse } from 'valibot';
import { booleanString, htmlCheckbox, omitEmptyFile, omitEmptyString } from '.';

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

describe('omitEmptyFile', () => {
  it('should return the file if size > 0', () => {
    const file = { size: 10 } as File;
    const result = omitEmptyFile().operation(file);
    expect(result).toBe(file);
  });

  it('should return undefined if size === 0', () => {
    const file = { size: 0 } as File;
    const result = omitEmptyFile().operation(file);
    expect(result).toBeUndefined();
  });
});

describe('omitEmptyString', () => {
  it('should return undefined for empty string', () => {
    const result = omitEmptyString<string>().operation('');
    expect(result).toBeUndefined();
  });

  it('should return the string if not empty', () => {
    const result = omitEmptyString<string>().operation('abc');
    expect(result).toBe('abc');
  });

  it('should filter out empty strings from array', () => {
    const result = omitEmptyString<string[]>().operation(['a', '', 'b', '']);
    expect(result).toEqual(['a', 'b']);
  });

  it('should return the same array if no empty strings', () => {
    const arr = ['a', 'b'];
    const result = omitEmptyString<string[]>().operation(arr);
    expect(result).toEqual(arr);
  });

  it('should return empty array if all strings are empty', () => {
    const result = omitEmptyString<string[]>().operation(['', '', '']);
    expect(result).toEqual([]);
  });
});

describe('htmlCheckbox', () => {
  it('should return true for "on"', () => {
    const result = parse(htmlCheckbox(), 'on');
    expect(result).toBe(true);
  });

  it('should return false for "off"', () => {
    const result = parse(htmlCheckbox(), 'off');
    expect(result).toBe(false);
  });

  it('should return false for undefined', () => {
    const result = parse(htmlCheckbox(), undefined);
    expect(result).toBe(false);
  });

  it('should return false for any other string', () => {
    const result = parse(htmlCheckbox(), 'something');
    expect(result).toBe(false);
  });
});
