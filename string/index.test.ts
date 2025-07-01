import { describe, it, expect } from 'bun:test';
import { substitute } from '.';

describe('substitute', () => {
  it('replaces variables in the template with values from context', () => {
    const template = 'Hello, ${name}! Welcome to ${place}.';
    const context = { name: 'Alice', place: 'Wonderland' };
    const result = substitute(template, context);

    expect(result.success).toBe(true);
    expect(result.data).toBe('Hello, Alice! Welcome to Wonderland.');
  });

  it('returns error if a variable is missing in context', () => {
    const template = 'Hello, ${name}! Welcome to ${place}.';
    const context = { name: 'Alice' };
    const result = substitute(template, context);

    expect(result.success).toBe(false);
    expect(result.error).toBe('missing_variable');
    expect(result.message).toBe('place');
  });

  it('returns the original string if there are no variables', () => {
    const template = 'Hello, world!';
    const context = { name: 'Alice' };
    const result = substitute(template, context);

    expect(result.success).toBe(true);
    expect(result.data).toBe('Hello, world!');
  });

  it('works with empty context and no variables', () => {
    const template = 'No variables here.';
    const context = {};
    const result = substitute(template, context);

    expect(result.success).toBe(true);
    expect(result.data).toBe('No variables here.');
  });

  it('returns error if context is empty and template has variables', () => {
    const template = 'Hello, ${name}!';
    const context = {};
    const result = substitute(template, context);

    expect(result.success).toBe(false);
    expect(result.error).toBe('missing_variable');
    expect(result.message).toContain('name');
  });

  it('replaces multiple occurrences of the same variable', () => {
    const template = '${word} ${word} ${word}';
    const context = { word: 'echo' };
    const result = substitute(template, context);

    expect(result.success).toBe(true);
    expect(result.data).toBe('echo echo echo');
  });
});
