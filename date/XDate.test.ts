import { describe, expect, it } from 'bun:test';
import { XDate } from './XDate';

describe('XDate', () => {
  it('addMonths', () => {
    expect(new XDate(2025, 0, 1).addMonths(1) as Date).toEqual(new Date(2025, 1, 1));
    expect(new XDate(2025, 2, 1).addMonths(1) as Date).toEqual(new Date(2025, 3, 1));
    expect(new XDate(2025, 11, 1).addMonths(1) as Date).toEqual(new Date(2026, 0, 1));

    expect(new XDate(2025, 0, 1).addMonths(2) as Date).toEqual(new Date(2025, 2, 1));
    expect(new XDate(2025, 10, 1).addMonths(2) as Date).toEqual(new Date(2026, 0, 1));
    expect(new XDate(2025, 11, 1).addMonths(2) as Date).toEqual(new Date(2026, 1, 1));

    expect(new XDate(2025, 11, 1).addMonths(0) as Date).toEqual(new Date(2025, 11, 1));
    expect(new XDate(2025, 0, 1).addMonths(0) as Date).toEqual(new Date(2025, 0, 1));

    expect(new XDate(2025, 0, 1).addMonths(-1) as Date).toEqual(new Date(2024, 11, 1));
    expect(new XDate(2025, 11, 1).addMonths(14) as Date).toEqual(new Date(2027, 1, 1));
  });

  it('addDays', () => {
    expect(new XDate(2023, 0, 30).addDays(1) as Date).toEqual(new Date(2023, 0, 31));
    expect(new XDate(2023, 0, 30).addDays(5) as Date).toEqual(new Date(2023, 1, 4));
    expect(new XDate(2023, 0, 25).addDays(35) as Date).toEqual(new Date(2023, 2, 1));
  });

  it('addHours', () => {
    expect(new XDate(2023, 1, 1, 8, 0).addHours(4) as Date).toEqual(new Date(2023, 1, 1, 12, 0));
    expect(new XDate(2023, 1, 1, 8, 0).addHours(20) as Date).toEqual(new Date(2023, 1, 2, 4, 0));
    expect(new XDate(2023, 1, 1, 8, 0).addHours(-4) as Date).toEqual(new Date(2023, 1, 1, 4, 0));
  });

  it('getQuarter', () => {
    expect(XDate.getQuarter(new Date(2023, 0, 1)).number).toBe(1);
    expect(XDate.getQuarter(new Date(2023, 2, 31)).number).toBe(1);
    expect(XDate.getQuarter(new Date(2023, 3, 1)).number).toBe(2);
    expect(XDate.getQuarter(new Date(2023, 5, 30)).number).toBe(2);
    expect(XDate.getQuarter(new Date(2023, 6, 1)).number).toBe(3);
    expect(XDate.getQuarter(new Date(2023, 8, 30)).number).toBe(3);
    expect(XDate.getQuarter(new Date(2023, 9, 1)).number).toBe(4);
    expect(XDate.getQuarter(new Date(2023, 11, 31)).number).toBe(4);
  });

  it('should convert a date to ISO date string', () => {
    expect(new XDate(2025, 3, 3).toISODateString()).toBe('2025-04-03');
    expect(new XDate(2022, 0, 1).toISODateString()).toBe('2022-01-01');
    expect(new XDate(2030, 11, 31).toISODateString()).toBe('2030-12-31');
  });

  it('atMonthStart', () => {
    expect(new XDate(2025, 0, 15).atMonthStart() as Date).toEqual(new Date(2025, 0, 1));
    expect(new XDate(2025, 1, 28).atMonthStart() as Date).toEqual(new Date(2025, 1, 1));
    expect(new XDate(2025, 2, 31).atMonthStart() as Date).toEqual(new Date(2025, 2, 1));
    expect(new XDate(2025, 11, 31).atMonthStart() as Date).toEqual(new Date(2025, 11, 1));
    expect(new XDate(2025, 6, 15).atMonthStart() as Date).toEqual(new Date(2025, 6, 1));

    expect(new XDate(2025, 0, 15, 4, 16, 58).atMonthStart() as Date).toEqual(new Date(2025, 0, 1));
    expect(new XDate(2025, 1, 28, 4, 16, 58).atMonthStart() as Date).toEqual(new Date(2025, 1, 1));
    expect(new XDate(2025, 2, 31, 4, 16, 58).atMonthStart() as Date).toEqual(new Date(2025, 2, 1));
    expect(new XDate(2025, 11, 31, 4, 16, 58).atMonthStart() as Date).toEqual(new Date(2025, 11, 1));
    expect(new XDate(2025, 6, 15, 4, 16, 58).atMonthStart() as Date).toEqual(new Date(2025, 6, 1));
  });

  it('atMonthEnd', () => {
    expect(new XDate(2025, 0, 15).atMonthEnd() as Date).toEqual(new Date(2025, 0, 31));
    expect(new XDate(2025, 1, 28).atMonthEnd() as Date).toEqual(new Date(2025, 1, 28));
    expect(new XDate(2025, 2, 30).atMonthEnd() as Date).toEqual(new Date(2025, 2, 31));
    expect(new XDate(2025, 11, 1).atMonthEnd() as Date).toEqual(new Date(2025, 11, 31));
    expect(new XDate(2025, 6, 15).atMonthEnd() as Date).toEqual(new Date(2025, 6, 31));

    expect(new XDate(2025, 0, 15, 4, 16, 58).atMonthEnd() as Date).toEqual(new Date(2025, 0, 31));
    expect(new XDate(2025, 1, 28, 4, 16, 58).atMonthEnd() as Date).toEqual(new Date(2025, 1, 28));
    expect(new XDate(2025, 2, 31, 4, 16, 58).atMonthEnd() as Date).toEqual(new Date(2025, 2, 31));
    expect(new XDate(2025, 11, 1, 4, 16, 58).atMonthEnd() as Date).toEqual(new Date(2025, 11, 31));
    expect(new XDate(2025, 6, 15, 4, 16, 58).atMonthEnd() as Date).toEqual(new Date(2025, 6, 31));
  });

  it('atYearStart', () => {
    expect(new XDate(2024, 0, 1).atYearStart() as Date).toEqual(new Date(2024, 0, 1));
    expect(new XDate(2024, 0, 2).atYearStart() as Date).toEqual(new Date(2024, 0, 1));
    expect(new XDate(2025, 8, 3).atYearStart() as Date).toEqual(new Date(2025, 0, 1));
    expect(new XDate(2025, 11, 31).atYearStart() as Date).toEqual(new Date(2025, 0, 1));
  });

  it('atYearEnd', () => {
    expect(new XDate(2024, 0, 1).atYearEnd() as Date).toEqual(new Date(2024, 11, 31));
    expect(new XDate(2024, 0, 2).atYearEnd() as Date).toEqual(new Date(2024, 11, 31));
    expect(new XDate(2025, 8, 3).atYearEnd() as Date).toEqual(new Date(2025, 11, 31));
    expect(new XDate(2025, 11, 31).atYearEnd() as Date).toEqual(new Date(2025, 11, 31));
  });
});
