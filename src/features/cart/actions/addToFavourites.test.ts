/**
 * @jest-environment node
 */
import { prisma } from '@/shared/lib/prisma';
import { describeWithDb } from '@/shared/test-utils/testDb';
import { CART_SESSION_COOKIE } from '@/features/cart/lib/cartSession';
import { mockProduct, randomSessionId } from '@/features/cart/test-utils/actionMocks';
import { addToFavourites } from './addToFavourites';

const mockCookieJar = new Map<string, string>();
const mockFindProduct = jest.fn();
const mockRevalidatePath = jest.fn();

jest.mock('@/shared/lib/prisma', () => {
  const { PrismaClient } = jest.requireActual('@prisma/client');
  return { prisma: new PrismaClient({ datasourceUrl: process.env.TEST_DATABASE_URL }) };
});

jest.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) =>
      mockCookieJar.has(name) ? { name, value: mockCookieJar.get(name) } : undefined,
    set: (name: string, value: string) => {
      mockCookieJar.set(name, value);
    },
  }),
}));

jest.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}));

jest.mock('@/features/cart/lib/findProduct', () => {
  const actual = jest.requireActual('@/features/cart/lib/findProduct');
  return {
    ...actual,
    findProduct: (...args: unknown[]) => mockFindProduct(...args),
  };
});

const createdSessions: string[] = [];

function useSession(sessionId = randomSessionId()) {
  mockCookieJar.set(CART_SESSION_COOKIE, sessionId);
  createdSessions.push(sessionId);
  return sessionId;
}

describeWithDb('addToFavourites', () => {
  beforeEach(() => {
    mockCookieJar.clear();
    mockFindProduct.mockReset();
    mockRevalidatePath.mockReset();
    mockFindProduct.mockImplementation(async (id: number) => mockProduct(id));
  });

  afterEach(async () => {
    const fromJar = mockCookieJar.get(CART_SESSION_COOKIE);
    const sessions = fromJar ? [...createdSessions, fromJar] : createdSessions;
    await prisma.favouriteItem.deleteMany({ where: { sessionId: { in: sessions } } });
    createdSessions.length = 0;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('saves the product under the existing session and returns it', async () => {
    const sessionId = useSession();

    const result = await addToFavourites(7);

    expect(result).toEqual({ ok: true, data: mockProduct(7) });
    const rows = await prisma.favouriteItem.findMany({ where: { sessionId } });
    expect(rows).toHaveLength(1);
    expect(rows[0].productId).toBe(7);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/cart');
  });

  it('creates a session cookie on first favourite and stores the row under it', async () => {
    const result = await addToFavourites(3);

    expect(result.ok).toBe(true);
    const sessionId = mockCookieJar.get(CART_SESSION_COOKIE);
    expect(sessionId).toBeDefined();
    const count = await prisma.favouriteItem.count({ where: { sessionId, productId: 3 } });
    expect(count).toBe(1);
  });

  it.each([0, -1, 1.5, Number.NaN, Number.MAX_SAFE_INTEGER])(
    'rejects invalid product id %p without touching the DB or cookie',
    async (productId) => {
      const result = await addToFavourites(productId);

      expect(result).toEqual({ ok: false, error: 'Invalid product' });
      expect(mockFindProduct).not.toHaveBeenCalled();
      expect(mockCookieJar.has(CART_SESSION_COOKIE)).toBe(false);
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    },
  );

  it('rejects a product the catalog does not know', async () => {
    const sessionId = useSession();
    mockFindProduct.mockResolvedValueOnce(null);

    const result = await addToFavourites(999);

    expect(result).toEqual({ ok: false, error: 'Product not found' });
    expect(await prisma.favouriteItem.count({ where: { sessionId } })).toBe(0);
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it('keeps a single row when the same product is favourited twice', async () => {
    const sessionId = useSession();

    const first = await addToFavourites(5);
    const second = await addToFavourites(5);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(await prisma.favouriteItem.count({ where: { sessionId, productId: 5 } })).toBe(1);
  });

  it('keeps a single row when the same product is favourited concurrently', async () => {
    const sessionId = useSession();

    const results = await Promise.all([addToFavourites(6), addToFavourites(6), addToFavourites(6)]);

    expect(results.every((r) => r.ok)).toBe(true);
    expect(await prisma.favouriteItem.count({ where: { sessionId, productId: 6 } })).toBe(1);
  });
});
