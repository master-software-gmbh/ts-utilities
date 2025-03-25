import { describe, expect, it } from 'bun:test';
import { compareRecords } from '.';

describe('compareRecords', () => {
  it('should detect missing number attribute', () => {
    const result = compareRecords(
      {
        a: 'string',
        b: 0,
      },
      {
        a: 'string',
      },
    );

    expect(result).toBe(false);
  });

  it('should detect missing string attribute', () => {
    const result = compareRecords(
      {
        a: 'string',
        b: 'string',
      },
      {
        a: 'string',
      },
    );

    expect(result).toBe(false);
  });

  it('should detect missing boolean attribute', () => {
    const result = compareRecords(
      {
        a: 'string',
        b: true,
      },
      {
        a: 'string',
      },
    );

    expect(result).toBe(false);
  });

  it('should allow missing boolean attribute with false value', () => {
    const result = compareRecords(
      {
        a: 'string',
        b: false,
      },
      {
        a: 'string',
      },
    );

    expect(result).toBe(true);
  });

  it('should detect string attribute with different value', () => {
    const result = compareRecords(
      {
        a: 'string',
        b: true,
      },
      {
        a: 'stringg',
        b: true,
      },
    );

    expect(result).toBe(false);
  });

  it('should detect number attribute with different value', () => {
    const result = compareRecords(
      {
        a: 0,
        b: true,
      },
      {
        a: 100,
        b: true,
      },
    );

    expect(result).toBe(false);
  });

  it('should detect boolean attribute with different value', () => {
    const result = compareRecords(
      {
        a: 'string',
        b: false,
      },
      {
        a: 'stringg',
        b: true,
      },
    );

    expect(result).toBe(false);
  });

  it('should allow records with equal attributes', () => {
    let result = compareRecords(
      {
        a: 'string',
        b: false,
      },
      {
        a: 'string',
        b: false,
      },
    );

    expect(result).toBe(true);

    result = compareRecords(
      {
        a: 'string',
        b: 500,
      },
      {
        a: 'string',
        b: 500,
      },
    );

    expect(result).toBe(true);
  });
});
