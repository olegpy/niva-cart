export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
export function validateMessageText(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return 'Message cannot be empty.';
  if (trimmed.length > 5000) return 'Message is too long.';
  return null;
}