import type { Order as PrismaOrder, OrderItem as PrismaOrderItem } from '@prisma/client';
import { toDomain, type OrderRow } from './toDomain';

const BASE_CREATED_AT = new Date('2026-06-10T12:00:00.000Z');
const BASE_UPDATED_AT = new Date('2026-06-10T12:05:00.000Z');

function makeItem(overrides: Partial<PrismaOrderItem> = {}): PrismaOrderItem {
  return {
    id: 'oi_1',
    orderId: 'o_1',
    productId: 42,
    titleSnapshot: 'Fixture Product',
    price: 1999,
    quantity: 2,
    ...overrides,
  };
}

function makeOrder(overrides: Partial<PrismaOrder> = {}, items: PrismaOrderItem[] = []): OrderRow {
  const base: PrismaOrder = {
    id: 'o_1',
    userId: 'u_1',
    stripeSessionId: 'cs_test_1',
    stripePaymentIntentId: 'pi_test_1',
    status: 'paid',
    total: 3998,
    currency: 'usd',
    customerEmail: 'buyer@example.com',
    createdAt: BASE_CREATED_AT,
    updatedAt: BASE_UPDATED_AT,
    ...overrides,
  };
  return { ...base, items };
}

describe('orders toDomain', () => {
  it('converts total and price from cents to dollars', () => {
    const row = makeOrder(
      { total: 2500 },
      [makeItem({ price: 1999 })],
    );

    const order = toDomain(row);

    expect(order.total).toBe(25);
    expect(order.items[0].unitPrice).toBe(19.99);
  });

  it('passes productId through when present', () => {
    const row = makeOrder({}, [makeItem({ productId: 7 })]);

    const order = toDomain(row);

    expect(order.items[0].productId).toBe(7);
  });

  it('passes nullable productId through as null', () => {
    const row = makeOrder({}, [makeItem({ productId: null })]);

    const order = toDomain(row);

    expect(order.items[0].productId).toBeNull();
  });

  it.each(['pending', 'paid', 'failed', 'refunded'] as const)(
    'passes %s status through unchanged',
    (status) => {
      const row = makeOrder({ status });

      const order = toDomain(row);

      expect(order.status).toBe(status);
    },
  );

  it('preserves item array order', () => {
    const items = [
      makeItem({ id: 'oi_a', titleSnapshot: 'A' }),
      makeItem({ id: 'oi_b', titleSnapshot: 'B' }),
      makeItem({ id: 'oi_c', titleSnapshot: 'C' }),
    ];
    const row = makeOrder({}, items);

    const order = toDomain(row);

    expect(order.items.map((i) => i.id)).toEqual(['oi_a', 'oi_b', 'oi_c']);
    expect(order.items.map((i) => i.titleSnapshot)).toEqual(['A', 'B', 'C']);
  });

  it('maps every item field on the way out', () => {
    const row = makeOrder({}, [
      makeItem({
        id: 'oi_1',
        productId: 11,
        titleSnapshot: 'Thing',
        price: 500,
        quantity: 3,
      }),
    ]);

    const order = toDomain(row);

    expect(order.items[0]).toEqual({
      id: 'oi_1',
      productId: 11,
      titleSnapshot: 'Thing',
      unitPrice: 5,
      quantity: 3,
    });
  });

  it('propagates top-level order metadata without mutation', () => {
    const row = makeOrder({
      id: 'o_42',
      userId: 'u_42',
      stripeSessionId: 'cs_test_abc',
      stripePaymentIntentId: null,
      currency: 'eur',
      customerEmail: 'eu@example.com',
      createdAt: BASE_CREATED_AT,
      updatedAt: BASE_UPDATED_AT,
    });

    const order = toDomain(row);

    expect(order.id).toBe('o_42');
    expect(order.userId).toBe('u_42');
    expect(order.stripeSessionId).toBe('cs_test_abc');
    expect(order.stripePaymentIntentId).toBeNull();
    expect(order.currency).toBe('eur');
    expect(order.customerEmail).toBe('eu@example.com');
    expect(order.createdAt).toBe(BASE_CREATED_AT);
    expect(order.updatedAt).toBe(BASE_UPDATED_AT);
  });
});
