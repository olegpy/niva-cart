/**
 * @jest-environment node
 */
import { prisma } from '@/shared/lib/prisma';
import { describeWithDb } from '@/shared/test-utils/testDb';

jest.mock('@/shared/lib/prisma', () => {
  const { PrismaClient } = jest.requireActual('@prisma/client');
  return { prisma: new PrismaClient({ datasourceUrl: process.env.TEST_DATABASE_URL }) };
});

import { getProduct, getProducts } from './products';

const FIXTURE_IDS = [900_001, 900_002, 900_003];

const fixtures = [
  {
    id: FIXTURE_IDS[0],
    title: 'Fixture Alpha',
    description: 'Alpha description',
    price: 1050,
    category: 'alpha-cat',
    stock: 7,
    thumbnail: '/products/fixture-alpha.jpg',
    images: ['/products/fixture-alpha-1.jpg', '/products/fixture-alpha-2.jpg'],
  },
  {
    id: FIXTURE_IDS[1],
    title: 'Fixture Beta',
    description: 'Beta description',
    price: 24999,
    category: 'beta-cat',
    stock: 3,
    thumbnail: '/products/fixture-beta.jpg',
    images: ['/products/fixture-beta-1.jpg'],
  },
  {
    id: FIXTURE_IDS[2],
    title: 'Fixture Gamma',
    description: 'Gamma description',
    price: 100,
    category: 'gamma-cat',
    stock: 0,
    thumbnail: '/products/fixture-gamma.jpg',
    images: [],
  },
];

describeWithDb('products data access', () => {
  beforeAll(async () => {
    for (const row of fixtures) {
      await prisma.product.upsert({
        where: { id: row.id },
        update: row,
        create: row,
      });
    }
  });

  afterAll(async () => {
    await prisma.product.deleteMany({ where: { id: { in: FIXTURE_IDS } } });
    await prisma.$disconnect();
  });

  it('returns every seeded product with dollars, quantity and string category', async () => {
    const products = await getProducts();
    const byId = new Map(products.map((p) => [p.id, p]));

    expect(byId.get(FIXTURE_IDS[0])).toEqual({
      id: FIXTURE_IDS[0],
      title: 'Fixture Alpha',
      description: 'Alpha description',
      price: 10.5,
      category: 'alpha-cat',
      quantity: 7,
      thumbnail: '/products/fixture-alpha.jpg',
      images: ['/products/fixture-alpha-1.jpg', '/products/fixture-alpha-2.jpg'],
    });
    expect(byId.get(FIXTURE_IDS[1])?.price).toBe(249.99);
    expect(byId.get(FIXTURE_IDS[1])?.quantity).toBe(3);
    expect(byId.get(FIXTURE_IDS[2])?.quantity).toBe(0);
  });

  it('returns the expected product for a known id', async () => {
    const product = await getProduct(String(FIXTURE_IDS[1]));

    expect(product).toEqual({
      id: FIXTURE_IDS[1],
      title: 'Fixture Beta',
      description: 'Beta description',
      price: 249.99,
      category: 'beta-cat',
      quantity: 3,
      thumbnail: '/products/fixture-beta.jpg',
      images: ['/products/fixture-beta-1.jpg'],
    });
  });

  it('throws a not-found error for an unknown numeric id', async () => {
    await expect(getProduct('99999999')).rejects.toThrow(/not found/i);
  });

  it('rejects non-numeric input', async () => {
    await expect(getProduct('abc')).rejects.toThrow(/invalid product id/i);
  });
});
