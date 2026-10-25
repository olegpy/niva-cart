export function formatCurrency(amount: number, currency: string): string {
  const code = currency.toUpperCase();
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(
      amount,
    );
  } catch {
    // Intl throws RangeError for codes it does not recognise.
    return `${code} ${amount.toFixed(2)}`;
  }
}
