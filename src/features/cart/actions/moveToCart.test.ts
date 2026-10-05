/**
 * @jest-environment node
 */
import { prisma } from '@/shared/lib/prisma';
import { describeWithDb } from '@/shared/test-utils/testDb';
import { CART_SESSION_COOKIE } from '@/features/cart/lib/cartSession';
import { mockProduct, randomSessionId } from '@/features/cart/test-utils/actionMocks';
import { moveToCart } from './moveToCart';

const mockCookieJar = new Map<string, string>();
const mockGetProduct = jest.fn();
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

jest.mock('@/features/products/api/products', () => ({
  getProduct: (...args: unknown[]) => mockGetProduct(...args),
}));

const usedSessions: string[] = [];

function session() {
  const id = randomSessionId();
  usedSessions.push(id);
  return id;
}

describeWithDb('moveToCart', () => {
  beforeEach(() => {
    mockCookieJar.clear();
    mockGetProduct.mockReset();
    mockRevalidatePath.mockReset();
    mockGetProduct.mockImplementation(async (id: string) => mockProduct(Number(id)));
  });

  afterEach(async () => {
    await prisma.favouriteItem.deleteMany({ where: { sessionId: { in: usedSessions } } });
    usedSessions.length = 0;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('removes the favourite row and returns the product re-derived from the API', async () => {
    const sessionId = session();
    mockCookieJar.set(CART_SESSION_COOKIE, sessionId);
    await prisma.favouriteItem.create({ data: { sessionId, productId: 4 } });
    mockGetProduct.mockResolvedValue(mockProduct(4, { price: 12.5 }));

    const result = await moveToCart(4);

    expect(result).toEqual({ ok: true, data: mockProduct(4, { price: 12.5 }) });
    expect(await prisma.favouriteItem.count({ where: { sessionId } })).toBe(0);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/cart');
  });

  it('returns "No session" when the visitor has no session cookie', async () => {
    const result = await moveToCart(4);

    expect(result).toEqual({ ok: false, error: 'No session' });
    expect(mockCookieJar.has(CART_SESSION_COOKIE)).toBe(false);
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it('returns "No session" when the session cookie is tampered', async () => {
    mockCookieJar.set(CART_SESSION_COOKIE, 'not-a-uuid');

    const result = await moveToCart(4);

    expect(result).toEqual({ ok: false, error: 'No session' });
  });

  it("never moves or deletes another session's favourite", async () => {
    const owner = session();
    const intruder = session();
    await prisma.favouriteItem.create({ data: { sessionId: owner, productId: 8 } });
    mockCookieJar.set(CART_SESSION_COOKIE, intruder);

    const result = await moveToCart(8);

    expect(result).toEqual({ ok: false, error: 'Not a favourite' });
    expect(await prisma.favouriteItem.count({ where: { sessionId: owner, productId: 8 } })).toBe(1);
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it('returns "Not a favourite" when the product was never favourited', async () => {
    mockCookieJar.set(CART_SESSION_COOKIE, session());

    const result = await moveToCart(42);

    expect(result).toEqual({ ok: false, error: 'Not a favourite' });
  });

  it('keeps the favourite row when the product no longer exists in the API', async () => {
    const sessionId = session();
    mockCookieJar.set(CART_SESSION_COOKIE, sessionId);
    await prisma.favouriteItem.create({ data: { sessionId, productId: 9 } });
    mockGetProduct.mockRejectedValue(new Error('Product with ID 9 not found'));

    const result = await moveToCart(9);

    expect(result).toEqual({ ok: false, error: 'Product not found' });
    expect(await prisma.favouriteItem.count({ where: { sessionId } })).toBe(1);
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it('rejects an invalid product id', async () => {
    mockCookieJar.set(CART_SESSION_COOKIE, session());

    const result = await moveToCart(-3);

    expect(result).toEqual({ ok: false, error: 'Invalid product' });
  });
});
