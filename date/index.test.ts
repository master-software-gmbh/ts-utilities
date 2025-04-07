import { describe, expect, it } from 'bun:test';
import './index';
import { getQuarter, getQuarterRange } from './index';

describe('toISODateString', () => {
  it('should convert a date to ISO date string', () => {
    expect(new Date(2025, 3, 3).toISODateString()).toBe('2025-04-03');
    expect(new Date(2022, 0, 1).toISODateString()).toBe('2022-01-01');
    expect(new Date(2030, 11, 31).toISODateString()).toBe('2030-12-31');
  });
});

describe('addDays', () => {
  it('should return correct date', () => {
    const date = new Date(2023, 0, 30);
    const expected = new Date(2023, 0, 31);
    expect(date.addDays(1)).toEqual(expected);
  });

  it('should return correct date', () => {
    const date = new Date(2023, 0, 30);
    const expected = new Date(2023, 1, 4);
    expect(date.addDays(5)).toEqual(expected);
  });

  it('should return correct date', () => {
    const date = new Date(2023, 0, 25);
    const expected = new Date(2023, 2, 1);
    expect(date.addDays(35)).toEqual(expected);
  });
});

describe('addHours', () => {
  it('should return correct date', () => {
    const date = new Date(2023, 1, 1, 8, 0);
    const expected = new Date(2023, 1, 1, 12, 0);
    expect(date.addHours(4)).toEqual(expected);
    expect(date).toEqual(new Date(2023, 1, 1, 8, 0));
  });

  it('should return correct date', () => {
    const date = new Date(2023, 1, 1, 8, 0);
    const expected = new Date(2023, 1, 2, 4, 0);
    expect(date.addHours(20)).toEqual(expected);
    expect(date).toEqual(new Date(2023, 1, 1, 8, 0));
  });

  it('should return correct date', () => {
    const date = new Date(2023, 1, 1, 8, 0);
    const expected = new Date(2023, 1, 1, 4, 0);
    expect(date.addHours(-4)).toEqual(expected);
    expect(date).toEqual(new Date(2023, 1, 1, 8, 0));
  });
});

describe('getQuarter', () => {
  it('should return first quarter for January', () => {
    expect(getQuarter(0)).toBe(1);
  });

  it('should return first quarter for February', () => {
    expect(getQuarter(1)).toBe(1);
  });

  it('should return first quarter for March', () => {
    expect(getQuarter(2)).toBe(1);
  });

  it('should return first quarter for April', () => {
    expect(getQuarter(3)).toBe(2);
  });

  it('should return first quarter for May', () => {
    expect(getQuarter(4)).toBe(2);
  });

  it('should return first quarter for June', () => {
    expect(getQuarter(5)).toBe(2);
  });

  it('should return first quarter for July', () => {
    expect(getQuarter(6)).toBe(3);
  });

  it('should return first quarter for August', () => {
    expect(getQuarter(7)).toBe(3);
  });

  it('should return first quarter for September', () => {
    expect(getQuarter(8)).toBe(3);
  });

  it('should return first quarter for October', () => {
    expect(getQuarter(9)).toBe(4);
  });

  it('should return first quarter for November', () => {
    expect(getQuarter(10)).toBe(4);
  });

  it('should return first quarter for December', () => {
    expect(getQuarter(11)).toBe(4);
  });

  it('should throw when monthIndex is too small', () => {
    expect(() => getQuarter(-1)).toThrow(Error);
  });

  it('should throw when monthIndex is too large', () => {
    expect(() => getQuarter(12)).toThrow(Error);
  });
});

describe('getQuarterRange', () => {
  it('should return range for first quarter', () => {
    expect(getQuarterRange(2024, 1)).toEqual({
      start: new Date(2024, 0, 1),
      end: new Date(2024, 2, 31),
    });
  });

  it('should return range for second quarter', () => {
    expect(getQuarterRange(2024, 2)).toEqual({
      start: new Date(2024, 3, 1),
      end: new Date(2024, 5, 30),
    });
  });

  it('should return range for third quarter', () => {
    expect(getQuarterRange(2024, 3)).toEqual({
      start: new Date(2024, 6, 1),
      end: new Date(2024, 8, 30),
    });
  });

  it('should return range for fourth quarter', () => {
    expect(getQuarterRange(2024, 4)).toEqual({
      start: new Date(2024, 9, 1),
      end: new Date(2024, 11, 31),
    });
  });

  it('should throw when quarter is too small', () => {
    expect(() => getQuarterRange(2024, 0)).toThrow(Error);
  });

  it('should throw when quarter is too large', () => {
    expect(() => getQuarterRange(2024, 5)).toThrow(Error);
  });
});
