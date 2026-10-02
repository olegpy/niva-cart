/**
 * @jest-environment node
 */
import { prisma } from '@/shared/lib/prisma';
import { describeWithDb } from '@/shared/test-utils/testDb';
import { CART_SESSION_COOKIE } from '@/features/cart/lib/cartSession';
import { mockProduct, randomSessionId } from '@/features/cart/test-utils/actionMocks';
import { getFavourites } from './getFavourites';

const mockCookieJar = new Map<string, string>();
const mockSet = jest.fn();
const mockGetProduct = jest.fn();

jest.mock('@/shared/lib/prisma', () => {
  const { PrismaClient } = jest.requireActual('@prisma/client');
  return { prisma: new PrismaClient({ datasourceUrl: process.env.TEST_DATABASE_URL }) };
});

jest.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) =>
      mockCookieJar.has(name) ? { name, value: mockCookieJar.get(name) } : undefined,
    set: (...args: unknown[]) => mockSet(...args),
  }),
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

describeWithDb('getFavourites', () => {
  beforeEach(() => {
    mockCookieJar.clear();
    mockSet.mockReset();
    mockGetProduct.mockReset();
    mockGetProduct.mockImplementation(async (id: string) => mockProduct(Number(id)));
  });

  afterEach(async () => {
    await prisma.favouriteItem.deleteMany({ where: { sessionId: { in: usedSessions } } });
    usedSessions.length = 0;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('returns an empty list without creating a session when there is no cookie', async () => {
    await expect(getFavourites()).resolves.toEqual([]);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('returns favourites newest first with product display data', async () => {
    const sessionId = session();
    mockCookieJar.set(CART_SESSION_COOKIE, sessionId);
    await prisma.favouriteItem.create({
      data: { sessionId, productId: 1, createdAt: new Date('2026-01-01T00:00:00Z') },
    });
    await prisma.favouriteItem.create({
      data: { sessionId, productId: 2, createdAt: new Date('2026-02-01T00:00:00Z') },
    });

    const items = await getFavourites();

    expect(items.map((i) => i.productId)).toEqual([2, 1]);
    expect(items[0]).toEqual({
      id: expect.any(Number),
      productId: 2,
      createdAt: new Date('2026-02-01T00:00:00Z'),
      title: 'Product 2',
      price: 20,
      image: '/product-2.jpg',
    });
  });

  it("does not return another session's favourites", async () => {
    const mine = session();
    const theirs = session();
    mockCookieJar.set(CART_SESSION_COOKIE, mine);
    await prisma.favouriteItem.create({ data: { sessionId: theirs, productId: 3 } });

    await expect(getFavourites()).resolves.toEqual([]);
  });

  it('skips products the API no longer returns', async () => {
    const sessionId = session();
    mockCookieJar.set(CART_SESSION_COOKIE, sessionId);
    await prisma.favouriteItem.createMany({
      data: [
        { sessionId, productId: 1 },
        { sessionId, productId: 404 },
      ],
    });
    mockGetProduct.mockImplementation(async (id: string) => {
      if (id === '404') throw new Error('Product with ID 404 not found');
      return mockProduct(Number(id));
    });

    const items = await getFavourites();

    expect(items.map((i) => i.productId)).toEqual([1]);
  });
});
