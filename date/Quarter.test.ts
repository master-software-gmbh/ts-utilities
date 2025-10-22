import { describe, expect, it } from 'bun:test';
import { Quarter } from './Quarter';
import { XDate } from './XDate';

describe('Quarter', () => {
  it('should return the start date', () => {
    expect(new Quarter(2020, 1).startDate).toEqual(new XDate(2020, 1, 1));
    expect(new Quarter(2020, 2).startDate).toEqual(new XDate(2020, 4, 1));
    expect(new Quarter(2020, 3).startDate).toEqual(new XDate(2020, 7, 1));
    expect(new Quarter(2020, 4).startDate).toEqual(new XDate(2020, 10, 1));
  });

  it('should return the end date', () => {
    expect(new Quarter(2020, 1).endDate).toEqual(new XDate(2020, 4, 1));
    expect(new Quarter(2020, 2).endDate).toEqual(new XDate(2020, 7, 1));
    expect(new Quarter(2020, 3).endDate).toEqual(new XDate(2020, 10, 1));
    expect(new Quarter(2020, 4).endDate).toEqual(new XDate(2021, 1, 1));
  });

  it('should return range for first quarter', () => {
    const range = new Quarter(2024, 1).range;

    expect(range.from).toEqual(new XDate(2024, 1, 1));
    expect(range.until).toEqual(new XDate(2024, 4, 1));
  });

  it('should return range for second quarter', () => {
    const range = new Quarter(2024, 2).range;

    expect(range.from).toEqual(new XDate(2024, 4, 1));
    expect(range.until).toEqual(new XDate(2024, 7, 1));
  });

  it('should return range for third quarter', () => {
    const range = new Quarter(2024, 3).range;

    expect(range.from).toEqual(new XDate(2024, 7, 1));
    expect(range.until).toEqual(new XDate(2024, 10, 1));
  });

  it('should return range for fourth quarter', () => {
    const range = new Quarter(2024, 4).range;

    expect(range.from).toEqual(new XDate(2024, 10, 1));
    expect(range.until).toEqual(new XDate(2025, 1, 1));
  });
});
