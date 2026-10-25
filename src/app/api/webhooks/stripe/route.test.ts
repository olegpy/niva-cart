/**
 * @jest-environment node
 */
import type Stripe from 'stripe';
import { prisma } from '@/shared/lib/prisma';
import { describeWithDb } from '@/shared/test-utils/testDb';

jest.mock('@/shared/lib/prisma', () => {
  const { PrismaClient } = jest.requireActual('@prisma/client');
  return { prisma: new PrismaClient({ datasourceUrl: process.env.TEST_DATABASE_URL }) };
});

const mockConstructEvent = jest.fn();
const mockListLineItems = jest.fn();
jest.mock('@/features/payments/lib/stripe', () => ({
  getStripe: () => ({
    webhooks: {
      constructEvent: (...args: unknown[]) => mockConstructEvent(...args),
    },
    checkout: {
      sessions: {
        listLineItems: (...args: unknown[]) => mockListLineItems(...args),
      },
    },
  }),
}));

import { POST } from './route';

const WEBHOOK_USER_ID = 'wh_test_user_1';
const PRODUCT_ID = 950_101;
const SIGNATURE = 't=1,v1=sig';

function buildRequest(body: string, signature: string | null): Request {
  const headers = new Headers();
  if (signature !== null) {
    headers.set('stripe-signature', signature);
  }
  return new Request('http://localhost/api/webhooks/stripe', {
    method: 'POST',
    headers,
    body,
  });
}

function makeSession(
  sessionId: string,
  overrides: Record<string, unknown> = {},
): Stripe.Checkout.Session {
  return {
    id: sessionId,
    object: 'checkout.session',
    metadata: { userId: WEBHOOK_USER_ID },
    payment_status: 'paid',
    amount_total: 3998,
    currency: 'usd',
    customer_details: { email: 'buyer@example.com' },
    payment_intent: 'pi_test_abc',
    ...overrides,
  } as unknown as Stripe.Checkout.Session;
}

function makeEvent(
  session: Stripe.Checkout.Session,
  type = 'checkout.session.completed',
): Stripe.Event {
  return {
    id: `evt_${session.id}`,
    object: 'event',
    api_version: '2026-09-30.endive',
    created: 1_700_000_000,
    data: { object: session },
    livemode: false,
    pending_webhooks: 0,
    request: { id: null, idempotency_key: null },
    type,
  } as unknown as Stripe.Event;
}

function makeLineItem(index: number, unitAmount = 1999, quantity = 1) {
  return {
    id: `li_${index}`,
    description: 'Webhook Alpha',
    quantity,
    price: {
      unit_amount: unitAmount,
      product: {
        id: 'prod_test_alpha',
        metadata: { productId: String(PRODUCT_ID) },
      },
    },
  };
}

function mockLineItems(items: unknown[]) {
  mockListLineItems.mockReturnValue({
    autoPagingToArray: jest.fn().mockResolvedValue(items),
  });
}

function deliver(event: Stripe.Event): Promise<Response> {
  mockConstructEvent.mockReturnValue(event);
  return POST(buildRequest('{}', SIGNATURE));
}

describeWithDb('POST /api/webhooks/stripe', () => {
  const originalWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  beforeAll(async () => {
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';

    await prisma.user.upsert({
      where: { email: 'webhook-tester@niva-cart.local' },
      update: { id: WEBHOOK_USER_ID, name: 'Webhook Tester' },
      create: {
        id: WEBHOOK_USER_ID,
        email: 'webhook-tester@niva-cart.local',
        name: 'Webhook Tester',
      },
    });
    await prisma.product.upsert({
      where: { id: PRODUCT_ID },
      update: {
        title: 'Webhook Alpha',
        description: 'wh desc',
        price: 1999,
        category: 'test',
        stock: 10,
        thumbnail: '/products/wh-alpha.jpg',
        images: [],
      },
      create: {
        id: PRODUCT_ID,
        title: 'Webhook Alpha',
        description: 'wh desc',
        price: 1999,
        category: 'test',
        stock: 10,
        thumbnail: '/products/wh-alpha.jpg',
        images: [],
      },
    });
  });

  beforeEach(async () => {
    mockConstructEvent.mockReset();
    mockListLineItems.mockReset();
    await prisma.orderItem.deleteMany({ where: { order: { userId: WEBHOOK_USER_ID } } });
    await prisma.order.deleteMany({ where: { userId: WEBHOOK_USER_ID } });
  });

  afterAll(async () => {
    process.env.STRIPE_WEBHOOK_SECRET = originalWebhookSecret;

    await prisma.orderItem.deleteMany({ where: { order: { userId: WEBHOOK_USER_ID } } });
    await prisma.order.deleteMany({ where: { userId: WEBHOOK_USER_ID } });
    await prisma.product.deleteMany({ where: { id: PRODUCT_ID } });
    await prisma.user.deleteMany({ where: { id: WEBHOOK_USER_ID } });
    await prisma.$disconnect();
  });

  it('returns 400 when the Stripe signature does not verify', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('bad sig');
    });

    const res = await POST(buildRequest('{"id":"evt_bad"}', 'invalid-sig'));

    expect(res.status).toBe(400);
    const ordersAfter = await prisma.order.count({ where: { userId: WEBHOOK_USER_ID } });
    expect(ordersAfter).toBe(0);
  });

  it('returns 400 when the signature header is missing', async () => {
    const res = await POST(buildRequest('{}', null));

    expect(res.status).toBe(400);
    expect(mockConstructEvent).not.toHaveBeenCalled();
  });

  it('returns 500 when the webhook secret is not configured', async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const res = await POST(buildRequest('{}', SIGNATURE));

      expect(res.status).toBe(500);
      expect(mockConstructEvent).not.toHaveBeenCalled();
    } finally {
      consoleError.mockRestore();
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
    }
  });

  it('creates an order with items on checkout.session.completed', async () => {
    const sessionId = 'cs_test_happy_1';
    mockLineItems([makeLineItem(1, 1999, 2)]);

    const res = await deliver(makeEvent(makeSession(sessionId)));

    expect(res.status).toBe(200);

    const orders = await prisma.order.findMany({
      where: { stripeSessionId: sessionId },
      include: { items: true },
    });
    expect(orders).toHaveLength(1);

    const order = orders[0];
    expect(order.status).toBe('paid');
    expect(order.total).toBe(3998);
    expect(order.customerEmail).toBe('buyer@example.com');
    expect(order.stripePaymentIntentId).toBe('pi_test_abc');
    expect(order.userId).toBe(WEBHOOK_USER_ID);
    expect(order.items).toHaveLength(1);

    const item = order.items[0];
    expect(item.productId).toBe(PRODUCT_ID);
    expect(item.price).toBe(1999);
    expect(item.quantity).toBe(2);
    expect(item.titleSnapshot).toBe('Webhook Alpha');
  });

  it('stores every line item when the session has more than ten', async () => {
    const sessionId = 'cs_test_many_items_1';
    mockLineItems(Array.from({ length: 12 }, (_, index) => makeLineItem(index)));

    const res = await deliver(makeEvent(makeSession(sessionId)));

    expect(res.status).toBe(200);
    const itemCount = await prisma.orderItem.count({
      where: { order: { stripeSessionId: sessionId } },
    });
    expect(itemCount).toBe(12);
  });

  it('does not create an order while a delayed payment is still unpaid', async () => {
    const sessionId = 'cs_test_unpaid_1';
    mockLineItems([makeLineItem(1)]);

    const res = await deliver(
      makeEvent(makeSession(sessionId, { payment_status: 'unpaid' })),
    );

    expect(res.status).toBe(200);
    expect(mockListLineItems).not.toHaveBeenCalled();
    const orders = await prisma.order.count({ where: { stripeSessionId: sessionId } });
    expect(orders).toBe(0);
  });

  it('creates the order when a delayed payment later succeeds', async () => {
    const sessionId = 'cs_test_async_paid_1';
    mockLineItems([makeLineItem(1)]);

    const res = await deliver(
      makeEvent(makeSession(sessionId), 'checkout.session.async_payment_succeeded'),
    );

    expect(res.status).toBe(200);
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
    });
    expect(order?.status).toBe('paid');
  });

  it('writes nothing when the session has no userId metadata', async () => {
    const sessionId = 'cs_test_no_user_1';
    mockLineItems([makeLineItem(1)]);
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const res = await deliver(makeEvent(makeSession(sessionId, { metadata: {} })));

    expect(res.status).toBe(200);
    expect(consoleError).toHaveBeenCalled();
    const orders = await prisma.order.count({ where: { stripeSessionId: sessionId } });
    expect(orders).toBe(0);
    consoleError.mockRestore();
  });

  it('is idempotent on replay with the same stripeSessionId', async () => {
    const sessionId = 'cs_test_idempotent_1';
    mockLineItems([makeLineItem(1, 1999, 2)]);

    const first = await deliver(makeEvent(makeSession(sessionId)));
    expect(first.status).toBe(200);

    const second = await deliver(makeEvent(makeSession(sessionId)));
    expect(second.status).toBe(200);

    const orders = await prisma.order.findMany({
      where: { stripeSessionId: sessionId },
      include: { items: true },
    });
    expect(orders).toHaveLength(1);
    expect(orders[0].items).toHaveLength(1);
  });

  it('returns 200 and keeps a single order when deliveries race', async () => {
    const sessionId = 'cs_test_race_1';
    mockLineItems([makeLineItem(1)]);

    const responses = await Promise.all([
      deliver(makeEvent(makeSession(sessionId))),
      deliver(makeEvent(makeSession(sessionId))),
    ]);

    expect(responses.map((res) => res.status)).toEqual([200, 200]);
    const orders = await prisma.order.count({ where: { stripeSessionId: sessionId } });
    expect(orders).toBe(1);
  });

  it('returns 200 and writes nothing for unknown event types', async () => {
    mockConstructEvent.mockReturnValue({
      id: 'evt_unknown_1',
      type: 'customer.created',
      data: { object: { id: 'cus_1' } },
    } as unknown as Stripe.Event);

    const res = await POST(buildRequest('{}', SIGNATURE));

    expect(res.status).toBe(200);
    expect(mockListLineItems).not.toHaveBeenCalled();
    const orders = await prisma.order.count({ where: { userId: WEBHOOK_USER_ID } });
    expect(orders).toBe(0);
  });
});
