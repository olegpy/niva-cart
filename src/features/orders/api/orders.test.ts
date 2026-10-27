/**
 * @jest-environment node
 */
import { prisma } from '@/shared/lib/prisma';
import { describeWithDb } from '@/shared/test-utils/testDb';

jest.mock('@/shared/lib/prisma', () => {
  const { PrismaClient } = jest.requireActual('@prisma/client');
  return { prisma: new PrismaClient({ datasourceUrl: process.env.TEST_DATABASE_URL }) };
});

import {
  getOrderByStripeSessionId,
  listAllOrders,
  listOrdersForUser,
} from './orders';

const USERS = {
  owner: 'orders_api_user_owner',
  other: 'orders_api_user_other',
};
const PRODUCT_ID = 950_201;

async function seedUser(id: string, email: string) {
  await prisma.user.upsert({
    where: { email },
    update: { id, name: 'Orders Tester' },
    create: { id, email, name: 'Orders Tester' },
  });
}

async function seedOrder(args: {
  userId: string;
  stripeSessionId: string;
  total: number;
  createdAt: Date;
}) {
  return prisma.order.create({
    data: {
      userId: args.userId,
      stripeSessionId: args.stripeSessionId,
      status: 'paid',
      total: args.total,
      currency: 'usd',
      customerEmail: 'buyer@example.com',
      createdAt: args.createdAt,
      items: {
        create: [
          {
            productId: PRODUCT_ID,
            titleSnapshot: 'Orders Alpha',
            price: args.total,
            quantity: 1,
          },
        ],
      },
    },
  });
}

describeWithDb('orders api', () => {
  beforeAll(async () => {
    await seedUser(USERS.owner, 'orders-owner@niva-cart.local');
    await seedUser(USERS.other, 'orders-other@niva-cart.local');
    await prisma.product.upsert({
      where: { id: PRODUCT_ID },
      update: {
        title: 'Orders Alpha',
        description: 'oa desc',
        price: 2500,
        category: 'test',
        stock: 10,
        thumbnail: '/products/oa.jpg',
        images: [],
      },
      create: {
        id: PRODUCT_ID,
        title: 'Orders Alpha',
        description: 'oa desc',
        price: 2500,
        category: 'test',
        stock: 10,
        thumbnail: '/products/oa.jpg',
        images: [],
      },
    });
  });

  beforeEach(async () => {
    await prisma.orderItem.deleteMany({
      where: { order: { userId: { in: [USERS.owner, USERS.other] } } },
    });
    await prisma.order.deleteMany({
      where: { userId: { in: [USERS.owner, USERS.other] } },
    });
  });

  afterAll(async () => {
    await prisma.orderItem.deleteMany({
      where: { order: { userId: { in: [USERS.owner, USERS.other] } } },
    });
    await prisma.order.deleteMany({
      where: { userId: { in: [USERS.owner, USERS.other] } },
    });
    await prisma.product.deleteMany({ where: { id: PRODUCT_ID } });
    await prisma.user.deleteMany({ where: { id: { in: [USERS.owner, USERS.other] } } });
    await prisma.$disconnect();
  });

  it('listOrdersForUser returns only orders owned by the given user', async () => {
    await seedOrder({
      userId: USERS.owner,
      stripeSessionId: 'cs_owner_1',
      total: 1000,
      createdAt: new Date('2026-06-01T10:00:00.000Z'),
    });
    await seedOrder({
      userId: USERS.other,
      stripeSessionId: 'cs_other_1',
      total: 2000,
      createdAt: new Date('2026-06-01T11:00:00.000Z'),
    });

    const owned = await listOrdersForUser(USERS.owner);

    expect(owned).toHaveLength(1);
    expect(owned[0].userId).toBe(USERS.owner);
    expect(owned[0].stripeSessionId).toBe('cs_owner_1');
  });

  it('listOrdersForUser returns orders newest first', async () => {
    await seedOrder({
      userId: USERS.owner,
      stripeSessionId: 'cs_owner_old',
      total: 100,
      createdAt: new Date('2026-05-01T00:00:00.000Z'),
    });
    await seedOrder({
      userId: USERS.owner,
      stripeSessionId: 'cs_owner_new',
      total: 200,
      createdAt: new Date('2026-07-01T00:00:00.000Z'),
    });

    const orders = await listOrdersForUser(USERS.owner);

    expect(orders.map((o) => o.stripeSessionId)).toEqual([
      'cs_owner_new',
      'cs_owner_old',
    ]);
  });

  it('listOrdersForUser includes items on each returned order', async () => {
    await seedOrder({
      userId: USERS.owner,
      stripeSessionId: 'cs_owner_items',
      total: 2500,
      createdAt: new Date('2026-06-10T00:00:00.000Z'),
    });

    const [order] = await listOrdersForUser(USERS.owner);

    expect(order.items).toHaveLength(1);
    expect(order.items[0].titleSnapshot).toBe('Orders Alpha');
    expect(order.items[0].quantity).toBe(1);
  });

  it('listAllOrders returns orders from every user, newest first', async () => {
    await seedOrder({
      userId: USERS.owner,
      stripeSessionId: 'cs_owner_all_1',
      total: 1000,
      createdAt: new Date('2026-06-01T00:00:00.000Z'),
    });
    await seedOrder({
      userId: USERS.other,
      stripeSessionId: 'cs_other_all_1',
      total: 2000,
      createdAt: new Date('2026-06-02T00:00:00.000Z'),
    });

    const all = await listAllOrders();
    const relevant = all.filter((o) =>
      [USERS.owner, USERS.other].includes(o.userId),
    );

    expect(relevant).toHaveLength(2);
    expect(relevant[0].stripeSessionId).toBe('cs_other_all_1');
    expect(relevant[1].stripeSessionId).toBe('cs_owner_all_1');
    expect(relevant[0].items).toHaveLength(1);
  });

  it('getOrderByStripeSessionId returns null for an unknown session id', async () => {
    const result = await getOrderByStripeSessionId('cs_does_not_exist');

    expect(result).toBeNull();
  });
});
