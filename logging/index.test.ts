import { describe, expect, it } from 'bun:test';
import { LoggingService } from '.';
import { stringify } from './logfmt';

describe('logfmt.stringify', () => {
  it('simple key value pairs', () => {
    const data = { foo: 'bar', a: 14 };
    expect(stringify(data)).toBe('foo=bar a=14');
  });

  it('true and false', () => {
    const data = { foo: true, bar: false };
    expect(stringify(data)).toBe('foo=true bar=false');
  });

  it('quotes strings with spaces in them', () => {
    const data = { foo: 'hello kitty' };
    expect(stringify(data)).toBe('foo="hello kitty"');
  });

  it('quotes strings with equals in them', () => {
    const data = { foo: 'hello=kitty' };
    expect(stringify(data)).toBe('foo="hello=kitty"');
  });

  it('quotes strings with quotes in them', () => {
    const data = { foo: JSON.stringify({ bar: 'baz' }) };
    expect(stringify(data)).toBe('foo="{\\"bar\\":\\"baz\\"}"');
  });

  it('serializes objects to JSON', () => {
    let data = { foo: { bar: 'baz' } };
    expect(stringify(data)).toBe('foo="{\\"bar\\":\\"baz\\"}"');

    data = { foo: { bar: 'baz bar' } };
    expect(stringify(data)).toBe('foo="{\\"bar\\":\\"baz bar\\"}"');
  });

  it('escapes quotes within strings with spaces in them', () => {
    let data = { foo: 'hello my "friend"' };
    expect(stringify(data)).toBe('foo="hello my \\"friend\\""');

    data = { foo: 'hello my "friend" whom I "love"' };
    expect(stringify(data)).toBe('foo="hello my \\"friend\\" whom I \\"love\\""');
  });

  it('escapes backslahes within strings', () => {
    const data = { foo: 'why would you use \\LaTeX?' };
    expect(stringify(data)).toBe('foo="why would you use \\\\LaTeX?"');
  });

  it('undefined is nothing', () => {
    const data = { foo: undefined };
    expect(stringify(data)).toBe('foo=');
  });

  it('null is nothing', () => {
    const data = { foo: null };
    expect(stringify(data)).toBe('foo=');
  });
});

const logger = new LoggingService('logfmt');

describe('data', () => {
  it('simple key value pairs', () => {
    const data = { foo: 'bar', a: 14 };
    expect(logger._data('info', 'message', data)).toEqual({ message: 'message', level: 'info', foo: 'bar', a: 14 });
  });

  it('transforms message and level', () => {
    const data = { foo: 'bar' };
    expect(logger._data('info', 'message', data)).toEqual({
      message: 'message',
      level: 'info',
      foo: 'bar',
    });
  });

  it('preserves string errors', () => {
    const data = { foo: 'bar', error: 'error message' };

    expect(logger._data('info', 'message', data)).toEqual({
      foo: 'bar',
      level: 'info',
      message: 'message',
      error: 'error message',
    });
  });

  it('extracts error message and stack', () => {
    const error = new TypeError('Test error');
    const data = { foo: 'bar', error };

    expect(logger._data('info', 'message', data)).toEqual({
      foo: 'bar',
      level: 'info',
      message: 'message',
      error: {
        name: error.name,
        stack: error.stack,
        message: error.message,
      },
    });
  });
});
