import { describe, expect, it } from 'bun:test';
import { days, hours, minutes, seconds, unixEpoch } from './index';

describe('unixEpoch', () => {
  it('should return the Unix epoch time in seconds for a given date', () => {
    const date = new Date('2025-02-03T14:46:58+00:00');
    const result = unixEpoch(date);
    expect(result).toBe(1738594018);
  });

  it('should handle dates before the Unix epoch', () => {
    const date = new Date('2020-02-03T14:46:58+00:00');
    const result = unixEpoch(date);
    expect(result).toBe(1580741218);
  });
});

describe('days', () => {
  it('should return the number of hours', () => {
    expect(days(2).inHours).toBe(48);
  });
});

describe('hours', () => {
  it('should return the number of minutes', () => {
    expect(hours(2).inMinutes).toBe(120);
  });

  it('should return the number of seconds', () => {
    expect(hours(1).inSeconds).toBe(3600);
  });
});

describe('minutes', () => {
  it('should return the number of seconds', () => {
    expect(minutes(30).inSeconds).toBe(1800);
  });

  it('should return the number of milliseconds', () => {
    expect(minutes(5).inMilliseconds).toBe(300_000);
  });
});

describe('seconds', () => {
  it('should return the number of milliseconds', () => {
    expect(seconds(15).inMilliseconds).toBe(15_000);
  });
});
