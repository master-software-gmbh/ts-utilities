import { describe, it, expect } from 'bun:test';
import { DateRange } from './DateRange';
import { XDate } from './XDate';

describe('DateRange', () => {
  it('should iterate over all dates of the range with different months', () => {
    const from = new XDate(2025, 6, 13);
    const to = new XDate(2025, 7, 4);
    const range = new DateRange(from, to);

    expect([...range]).toEqual([
      new XDate(2025, 6, 13),
      new XDate(2025, 6, 14),
      new XDate(2025, 6, 15),
      new XDate(2025, 6, 16),
      new XDate(2025, 6, 17),
      new XDate(2025, 6, 18),
      new XDate(2025, 6, 19),
      new XDate(2025, 6, 20),
      new XDate(2025, 6, 21),
      new XDate(2025, 6, 22),
      new XDate(2025, 6, 23),
      new XDate(2025, 6, 24),
      new XDate(2025, 6, 25),
      new XDate(2025, 6, 26),
      new XDate(2025, 6, 27),
      new XDate(2025, 6, 28),
      new XDate(2025, 6, 29),
      new XDate(2025, 6, 30),
      new XDate(2025, 7, 1),
      new XDate(2025, 7, 2),
      new XDate(2025, 7, 3),
    ]);
  });
  
  it('should iterate over all dates of the range', () => {
    const from = new XDate(2025, 8, 1);
    const to = new XDate(2025, 8, 12);
    const range = new DateRange(from, to);

    expect([...range]).toEqual([
      new XDate(2025, 8, 1),
      new XDate(2025, 8, 2),
      new XDate(2025, 8, 3),
      new XDate(2025, 8, 4),
      new XDate(2025, 8, 5),
      new XDate(2025, 8, 6),
      new XDate(2025, 8, 7),
      new XDate(2025, 8, 8),
      new XDate(2025, 8, 9),
      new XDate(2025, 8, 10),
      new XDate(2025, 8, 11),
    ]);
  });
  
  it('should iterate over all dates of the range with different years', () => {
    const from = new XDate(2025, 12, 28);
    const to = new XDate(2026, 1, 5);
    const range = new DateRange(from, to);

    expect([...range]).toEqual([
      new XDate(2025, 12, 28),
      new XDate(2025, 12, 29),
      new XDate(2025, 12, 30),
      new XDate(2025, 12, 31),
      new XDate(2026, 1, 1),
      new XDate(2026, 1, 2),
      new XDate(2026, 1, 3),
      new XDate(2026, 1, 4),
    ]);
  });
})