import { describe, expect, it } from 'bun:test';
import { getErrorMessage } from '.';

describe('getErrorMessage', () => {
  it('should return message from Error', () => {
    const error = new Error('This is an error.');
    expect(getErrorMessage(error)).toEqual('This is an error.');
  });

  it('should return message from string', () => {
    const error = 'This is a string.';
    expect(getErrorMessage(error)).toEqual('This is a string.');
  });

  it('should return message from number', () => {
    const error = 5;
    expect(getErrorMessage(error)).toEqual('5');
  });

  it('should return message from object', () => {
    const error = { foo: 'bar', n: 5 };
    expect(getErrorMessage(error)).toEqual('{"foo":"bar","n":5}');
  });
});
