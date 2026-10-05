import 'server-only';
import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';

export const CART_SESSION_COOKIE = 'niva-cart-session';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidSessionId(value: string | undefined): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

export async function getSessionId(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(CART_SESSION_COOKIE)?.value;
  return isValidSessionId(value) ? value : null;
}

/** Sets a cookie, so it may only be called from a server action or route handler. */
export async function getOrCreateSessionId(): Promise<string> {
  const existing = await getSessionId();
  if (existing) {
    return existing;
  }

  const sessionId = randomUUID();
  const store = await cookies();
  store.set(CART_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  return sessionId;
}
