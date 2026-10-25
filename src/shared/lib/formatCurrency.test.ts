import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('formats a USD amount with symbol and two decimals', () => {
    expect(formatCurrency(19.99, 'usd')).toBe('$19.99');
  });

  it('accepts lowercase and uppercase currency codes alike', () => {
    expect(formatCurrency(5, 'eur')).toBe(formatCurrency(5, 'EUR'));
  });

  it('falls back to "CODE amount" for an unrecognised currency code', () => {
    expect(formatCurrency(5, 'x')).toBe('X 5.00');
  });
});
