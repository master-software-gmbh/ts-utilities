import { describe, it, expect } from 'bun:test';
import { gigabytes, kilobytes, megabytes, terabytes } from './utilities';

describe('kilobytes', () => {
  it('should convert kilobytes to bytes', () => {
    expect(kilobytes(5).inBytes).toEqual(5_000);
  });

  it('should convert megabytes to bytes', () => {
    expect(megabytes(1).inBytes).toEqual(1_000_000);
  });

  it('should convert megabytes to kilobytes', () => {
    expect(megabytes(123).inKilobytes).toEqual(123_000);
  });

  it('should convert gigabytes to megabytes', () => {
    expect(gigabytes(1.5).inMegabytes).toEqual(1_500);
  });

  it('should convert gigabytes to bytes', () => {
    expect(gigabytes(1.5).inBytes).toEqual(1_500_000_000);
  });

  it('should convert terabytes to megabytes', () => {
    expect(terabytes(8).inMegabytes).toEqual(8_000_000);
  });
});
