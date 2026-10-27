import { firstParam } from './firstParam';

describe('firstParam', () => {
  it('returns a plain string value', () => {
    expect(firstParam('abc')).toBe('abc');
  });

  it('returns the first entry when the param is repeated', () => {
    expect(firstParam(['first', 'second'])).toBe('first');
  });

  it('trims surrounding whitespace', () => {
    expect(firstParam('  abc  ')).toBe('abc');
  });

  it.each([undefined, '', '   ', []])('returns null for %p', (raw) => {
    expect(firstParam(raw as string | string[] | undefined)).toBeNull();
  });
});
