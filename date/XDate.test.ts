import { describe, expect, it } from 'bun:test';
import { XDate } from './XDate';

describe('XDate', () => {
  it('fromISO', () => {
    expect(XDate.fromISO('2020-01-01')).toEqual(new XDate(2020, 1, 1));
    expect(XDate.fromISO('2025-06-23')).toEqual(new XDate(2025, 6, 23));
  });

  it('addMonths', () => {
    expect(new XDate(2025, 1, 1).addMonths(1)).toEqual(new XDate(2025, 2, 1));
    expect(new XDate(2025, 2, 1).addMonths(1)).toEqual(new XDate(2025, 3, 1));
    expect(new XDate(2025, 12, 1).addMonths(1)).toEqual(new XDate(2026, 1, 1));

    expect(new XDate(2025, 1, 1).addMonths(2)).toEqual(new XDate(2025, 3, 1));
    expect(new XDate(2025, 11, 1).addMonths(2)).toEqual(new XDate(2026, 1, 1));
    expect(new XDate(2025, 12, 1).addMonths(2)).toEqual(new XDate(2026, 2, 1));

    expect(new XDate(2025, 11, 1).addMonths(0)).toEqual(new XDate(2025, 11, 1));
    expect(new XDate(2025, 1, 1).addMonths(0)).toEqual(new XDate(2025, 1, 1));

    expect(new XDate(2025, 1, 1).addMonths(-1)).toEqual(new XDate(2024, 12, 1));
    expect(new XDate(2025, 12, 1).addMonths(14)).toEqual(new XDate(2027, 2, 1));
  });

  it('addDays', () => {
    expect(new XDate(2023, 1, 30).addDays(1)).toEqual(new XDate(2023, 1, 31));
    expect(new XDate(2023, 1, 30).addDays(5)).toEqual(new XDate(2023, 2, 4));
    expect(new XDate(2023, 1, 25).addDays(35)).toEqual(new XDate(2023, 3, 1));
  });

  it('addYears', () => {
    expect(new XDate(2023, 1, 30).addYears(1)).toEqual(new XDate(2024, 1, 30));
    expect(new XDate(2023, 1, 30).addYears(5)).toEqual(new XDate(2028, 1, 30));
    expect(new XDate(2023, 1, 25).addYears(-2)).toEqual(new XDate(2021, 1, 25));
    expect(new XDate(2020, 2, 29).addYears(2)).toEqual(new XDate(2022, 3, 1));
  });

  it('getQuarter', () => {
    expect(XDate.getQuarter(new XDate(2023, 1, 1)).number).toBe(1);
    expect(XDate.getQuarter(new XDate(2023, 3, 31)).number).toBe(1);
    expect(XDate.getQuarter(new XDate(2023, 4, 1)).number).toBe(2);
    expect(XDate.getQuarter(new XDate(2023, 6, 30)).number).toBe(2);
    expect(XDate.getQuarter(new XDate(2023, 7, 1)).number).toBe(3);
    expect(XDate.getQuarter(new XDate(2023, 9, 30)).number).toBe(3);
    expect(XDate.getQuarter(new XDate(2023, 10, 1)).number).toBe(4);
    expect(XDate.getQuarter(new XDate(2023, 12, 31)).number).toBe(4);
  });

  it('should convert a date to ISO date string', () => {
    expect(new XDate(2025, 4, 3).toISODateString()).toBe('2025-04-03');
    expect(new XDate(2022, 1, 1).toISODateString()).toBe('2022-01-01');
    expect(new XDate(2030, 12, 31).toISODateString()).toBe('2030-12-31');
  });

  it('atMonthStart', () => {
    expect(new XDate(2025, 1, 15).atMonthStart()).toEqual(new XDate(2025, 1, 1));
    expect(new XDate(2025, 2, 28).atMonthStart()).toEqual(new XDate(2025, 2, 1));
    expect(new XDate(2025, 3, 31).atMonthStart()).toEqual(new XDate(2025, 3, 1));
    expect(new XDate(2025, 12, 31).atMonthStart()).toEqual(new XDate(2025, 12, 1));
    expect(new XDate(2025, 7, 15).atMonthStart()).toEqual(new XDate(2025, 7, 1));

    expect(new XDate(2025, 1, 15).atMonthStart()).toEqual(new XDate(2025, 1, 1));
    expect(new XDate(2025, 2, 28).atMonthStart()).toEqual(new XDate(2025, 2, 1));
    expect(new XDate(2025, 3, 31).atMonthStart()).toEqual(new XDate(2025, 3, 1));
    expect(new XDate(2025, 12, 31).atMonthStart()).toEqual(new XDate(2025, 12, 1));
    expect(new XDate(2025, 7, 15).atMonthStart()).toEqual(new XDate(2025, 7, 1));
  });

  it('atMonthEnd', () => {
    expect(new XDate(2025, 1, 15).atMonthEnd()).toEqual(new XDate(2025, 1, 31));
    expect(new XDate(2025, 2, 28).atMonthEnd()).toEqual(new XDate(2025, 2, 28));
    expect(new XDate(2025, 3, 30).atMonthEnd()).toEqual(new XDate(2025, 3, 31));
    expect(new XDate(2025, 12, 1).atMonthEnd()).toEqual(new XDate(2025, 12, 31));
    expect(new XDate(2025, 7, 15).atMonthEnd()).toEqual(new XDate(2025, 7, 31));

    expect(new XDate(2025, 1, 15).atMonthEnd()).toEqual(new XDate(2025, 1, 31));
    expect(new XDate(2025, 2, 28).atMonthEnd()).toEqual(new XDate(2025, 2, 28));
    expect(new XDate(2025, 3, 31).atMonthEnd()).toEqual(new XDate(2025, 3, 31));
    expect(new XDate(2025, 12, 1).atMonthEnd()).toEqual(new XDate(2025, 12, 31));
    expect(new XDate(2025, 7, 15).atMonthEnd()).toEqual(new XDate(2025, 7, 31));
  });

  it('atYearStart', () => {
    expect(new XDate(2024, 1, 1).atYearStart()).toEqual(new XDate(2024, 1, 1));
    expect(new XDate(2024, 1, 2).atYearStart()).toEqual(new XDate(2024, 1, 1));
    expect(new XDate(2025, 9, 3).atYearStart()).toEqual(new XDate(2025, 1, 1));
    expect(new XDate(2025, 12, 31).atYearStart()).toEqual(new XDate(2025, 1, 1));
  });

  it('atYearEnd', () => {
    expect(new XDate(2024, 0, 1).atYearEnd()).toEqual(new XDate(2024, 12, 31));
    expect(new XDate(2024, 0, 2).atYearEnd()).toEqual(new XDate(2024, 12, 31));
    expect(new XDate(2025, 8, 3).atYearEnd()).toEqual(new XDate(2025, 12, 31));
    expect(new XDate(2025, 11, 31).atYearEnd()).toEqual(new XDate(2025, 12, 31));
  });
});
