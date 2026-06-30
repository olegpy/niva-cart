import { cn } from './cn';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('skips falsy values', () => {
    expect(cn('base', false && 'hidden', null, undefined, 'end')).toBe('base end');
  });

  it('merges conflicting tailwind classes with tailwind-merge', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
