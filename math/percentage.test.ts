import { describe, expect, it } from 'bun:test';
import { Percentage } from './percentage.js';

describe('Percentages', () => {
  it('should compare', () => {
    expect(new Percentage(50).compareTo(new Percentage(25))).toBe(-1);
    expect(new Percentage(25).compareTo(new Percentage(25))).toBe(0);
  });

  it('should multiply', () => {
    expect(new Percentage(3.5).multiplyWith(5900)).toBe(206.5);
  });
});
