/**
 * @jest-environment node
 */
import { CART_SESSION_COOKIE, getOrCreateSessionId, getSessionId } from './cartSession';

const mockGet = jest.fn();
const mockSet = jest.fn();

jest.mock('next/headers', () => ({
  cookies: async () => ({
    get: (...args: unknown[]) => mockGet(...args),
    set: (...args: unknown[]) => mockSet(...args),
  }),
}));

const VALID_ID = '3f2b8c1e-4d5a-4b6c-9d7e-1a2b3c4d5e6f';
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function cookieValue(value: string | undefined) {
  mockGet.mockImplementation((name: string) =>
    name === CART_SESSION_COOKIE && value !== undefined ? { name, value } : undefined,
  );
}

describe('getSessionId', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockSet.mockReset();
  });

  it('returns null when the cookie is absent', async () => {
    cookieValue(undefined);
    await expect(getSessionId()).resolves.toBeNull();
  });

  it('returns the id when the cookie holds a valid UUID', async () => {
    cookieValue(VALID_ID);
    await expect(getSessionId()).resolves.toBe(VALID_ID);
  });

  it.each(['not-a-uuid', '', "1' OR '1'='1", `${VALID_ID}x`])(
    'rejects a tampered cookie value %p',
    async (value) => {
      cookieValue(value);
      await expect(getSessionId()).resolves.toBeNull();
    },
  );

  it('never writes a cookie', async () => {
    cookieValue(undefined);
    await getSessionId();
    expect(mockSet).not.toHaveBeenCalled();
  });
});

describe('getOrCreateSessionId', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockSet.mockReset();
  });

  it('reuses an existing valid session without rewriting the cookie', async () => {
    cookieValue(VALID_ID);
    await expect(getOrCreateSessionId()).resolves.toBe(VALID_ID);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('creates a new UUID session cookie when none exists', async () => {
    cookieValue(undefined);

    const id = await getOrCreateSessionId();

    expect(id).toMatch(UUID_V4);
    expect(mockSet).toHaveBeenCalledWith(
      CART_SESSION_COOKIE,
      id,
      expect.objectContaining({ httpOnly: true, sameSite: 'lax', path: '/' }),
    );
  });

  it('sets a session cookie with no expiry', async () => {
    cookieValue(undefined);

    await getOrCreateSessionId();

    const options = mockSet.mock.calls[0][2];
    expect(options).not.toHaveProperty('maxAge');
    expect(options).not.toHaveProperty('expires');
  });

  it('replaces an invalid cookie value with a fresh UUID', async () => {
    cookieValue('garbage');

    const id = await getOrCreateSessionId();

    expect(id).toMatch(UUID_V4);
    expect(id).not.toBe('garbage');
    expect(mockSet).toHaveBeenCalledTimes(1);
  });

  it('marks the cookie secure only in production', async () => {
    cookieValue(undefined);
    await getOrCreateSessionId();
    expect(mockSet.mock.calls[0][2].secure).toBe(false);

    const env = process.env as Record<string, string | undefined>;
    const previous = env.NODE_ENV;
    env.NODE_ENV = 'production';
    try {
      mockSet.mockReset();
      await getOrCreateSessionId();
      expect(mockSet.mock.calls[0][2].secure).toBe(true);
    } finally {
      env.NODE_ENV = previous;
    }
  });
});
