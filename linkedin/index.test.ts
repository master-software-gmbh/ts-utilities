import { describe, expect, it } from 'bun:test';
import { parseUsername } from '.';

describe('parseUsername', () => {
  it('should parse the username', () => {
    expect(parseUsername('https://www.linkedin.com/in/marianeickmeyer/')).toBe('marianeickmeyer');
    expect(parseUsername('https://www.linkedin.com/in/marianeickmeyer')).toBe('marianeickmeyer');
    expect(parseUsername('www.linkedin.com/in/marianeickmeyer/')).toBe('marianeickmeyer');
    expect(parseUsername('www.linkedin.com/in/marianeickmeyer')).toBe('marianeickmeyer');
    expect(parseUsername('linkedin.com/in/marianeickmeyer/')).toBe('marianeickmeyer');
    expect(parseUsername('linkedin.com/in/marianeickmeyer')).toBe('marianeickmeyer');
    expect(parseUsername('marianeickmeyer')).toBe('marianeickmeyer');
    expect(parseUsername('www.linkedin.com/in/marian-eickmeyer-bb0543174')).toBe('marian-eickmeyer-bb0543174');
    expect(parseUsername('www.linkedin.com/in/marian-eickmeyer-bb0543174/')).toBe('marian-eickmeyer-bb0543174');
    expect(parseUsername('https://www.linkedin.com/in/marian-eickmeyer-bb0543174')).toBe('marian-eickmeyer-bb0543174');
    expect(parseUsername('https://www.linkedin.com/in/marian-eickmeyer-bb0543174/')).toBe('marian-eickmeyer-bb0543174');
    expect(parseUsername('linkedin.com/in/marian-eickmeyer-bb0543174/')).toBe('marian-eickmeyer-bb0543174');
    expect(parseUsername('linkedin.com/in/marian-eickmeyer-bb0543174')).toBe('marian-eickmeyer-bb0543174');
  });
});
