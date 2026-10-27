/**
 * @jest-environment node
 */
import { prisma } from '@/shared/lib/prisma';
import { describeWithDb } from '@/shared/test-utils/testDb';

jest.mock('@/shared/lib/prisma', () => {
  const { PrismaClient } = jest.requireActual('@prisma/client');
  return { prisma: new PrismaClient({ datasourceUrl: process.env.TEST_DATABASE_URL }) };
});

const mockGetServerSession = jest.fn();
jest.mock('next-auth', () => ({
  getServerSession: (...args: unknown[]) => mockGetServerSession(...args),
}));

jest.mock('@/features/admin/auth/lib/auth', () => ({
  authOptions: {},
}));

const mockSessionsCreate = jest.fn();
jest.mock('@/features/payments/lib/stripe', () => ({
  getStripe: () => ({
    checkout: {
      sessions: {
        create: (...args: unknown[]) => mockSessionsCreate(...args),
      },
    },
  }),
  StripeNotConfiguredError: class StripeNotConfiguredError extends Error {
    readonly code = 'STRIPE_NOT_CONFIGURED';
    constructor() {
      super('STRIPE_SECRET_KEY is not set');
      this.name = 'StripeNotConfiguredError';
    }
  },
  getCheckoutUrls: () => ({
    successUrl: 'https://test.local/checkout/success?session_id={CHECKOUT_SESSION_ID}',
    cancelUrl: 'https://test.local/cart',
  }),
}));

import { createCheckoutSession } from './createCheckoutSession';

const PRODUCT_IDS = {
  alpha: 950_001,
  beta: 950_002,
};

const USER_ID = 'ckout_test_user_1';

describeWithDb('createCheckoutSession', () => {
  beforeAll(async () => {
    await prisma.product.upsert({
      where: { id: PRODUCT_IDS.alpha },
      update: {
        title: 'Checkout Alpha',
        description: 'alpha desc',
        price: 1999,
        category: 'test',
        stock: 10,
        thumbnail: '/products/alpha.jpg',
        images: ['/products/alpha-1.jpg'],
      },
      create: {
        id: PRODUCT_IDS.alpha,
        title: 'Checkout Alpha',
        description: 'alpha desc',
        price: 1999,
        category: 'test',
        stock: 10,
        thumbnail: '/products/alpha.jpg',
        images: ['/products/alpha-1.jpg'],
      },
    });
    await prisma.product.upsert({
      where: { id: PRODUCT_IDS.beta },
      update: {
        title: 'Checkout Beta',
        description: 'beta desc',
        price: 500,
        category: 'test',
        stock: 10,
        thumbnail: '/products/beta.jpg',
        images: ['/products/beta-1.jpg'],
      },
      create: {
        id: PRODUCT_IDS.beta,
        title: 'Checkout Beta',
        description: 'beta desc',
        price: 500,
        category: 'test',
        stock: 10,
        thumbnail: '/products/beta.jpg',
        images: ['/products/beta-1.jpg'],
      },
    });

    await prisma.user.upsert({
      where: { email: 'checkout-tester@niva-cart.local' },
      update: { id: USER_ID, name: 'Checkout Tester' },
      create: {
        id: USER_ID,
        email: 'checkout-tester@niva-cart.local',
        name: 'Checkout Tester',
      },
    });
  });

  afterAll(async () => {
    await prisma.product.deleteMany({
      where: { id: { in: [PRODUCT_IDS.alpha, PRODUCT_IDS.beta] } },
    });
    await prisma.user.deleteMany({ where: { id: USER_ID } });
    await prisma.$disconnect();
  });

  beforeEach(() => {
    mockGetServerSession.mockReset();
    mockSessionsCreate.mockReset();
    mockSessionsCreate.mockResolvedValue({ url: 'https://stripe.test/session/xyz' });
  });

  function signedIn() {
    mockGetServerSession.mockResolvedValue({
      user: {
        id: USER_ID,
        email: 'checkout-tester@niva-cart.local',
        role: 'customer',
      },
    });
  }

  it('rejects callers who are not signed in', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const result = await createCheckoutSession({
      items: [{ productId: PRODUCT_IDS.alpha, quantity: 1 }],
    });

    expect(result).toEqual({ ok: false, error: 'Not signed in' });
    expect(mockSessionsCreate).not.toHaveBeenCalled();
  });

  it('rejects an empty cart', async () => {
    signedIn();

    const result = await createCheckoutSession({ items: [] });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/empty/i);
    }
    expect(mockSessionsCreate).not.toHaveBeenCalled();
  });

  it('rejects quantities below 1', async () => {
    signedIn();

    const result = await createCheckoutSession({
      items: [{ productId: PRODUCT_IDS.alpha, quantity: 0 }],
    });

    expect(result).toEqual({ ok: false, error: 'Invalid cart contents' });
    expect(mockSessionsCreate).not.toHaveBeenCalled();
  });

  it('rejects quantities above 99', async () => {
    signedIn();

    const result = await createCheckoutSession({
      items: [{ productId: PRODUCT_IDS.alpha, quantity: 100 }],
    });

    expect(result).toEqual({ ok: false, error: 'Invalid cart contents' });
    expect(mockSessionsCreate).not.toHaveBeenCalled();
  });

  it('returns an availability error when a product id does not exist', async () => {
    signedIn();

    const result = await createCheckoutSession({
      items: [{ productId: 999_999_999, quantity: 1 }],
    });

    expect(result).toEqual({
      ok: false,
      error: 'Some items are no longer available',
    });
    expect(mockSessionsCreate).not.toHaveBeenCalled();
  });

  it('rejects the same product listed twice', async () => {
    signedIn();

    const result = await createCheckoutSession({
      items: [
        { productId: PRODUCT_IDS.alpha, quantity: 1 },
        { productId: PRODUCT_IDS.alpha, quantity: 2 },
      ],
    });

    expect(result).toEqual({ ok: false, error: 'Invalid cart contents' });
    expect(mockSessionsCreate).not.toHaveBeenCalled();
  });

  it('rejects carts with more than 100 line items', async () => {
    signedIn();

    const result = await createCheckoutSession({
      items: Array.from({ length: 101 }, (_, index) => ({
        productId: index + 1,
        quantity: 1,
      })),
    });

    expect(result).toEqual({ ok: false, error: 'Invalid cart contents' });
    expect(mockSessionsCreate).not.toHaveBeenCalled();
  });

  it('returns a safe error when Stripe fails', async () => {
    signedIn();
    mockSessionsCreate.mockRejectedValue(new Error('stripe is down'));
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await createCheckoutSession({
      items: [{ productId: PRODUCT_IDS.alpha, quantity: 1 }],
    });

    expect(result).toEqual({ ok: false, error: 'Checkout failed' });
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('uses the DB price in cents, not any client-sent value', async () => {
    signedIn();

    await createCheckoutSession({
      items: [{ productId: PRODUCT_IDS.alpha, quantity: 2 }],
    });

    expect(mockSessionsCreate).toHaveBeenCalledTimes(1);
    const [params] = mockSessionsCreate.mock.calls[0];
    expect(params.line_items).toHaveLength(1);
    expect(params.line_items[0].price_data.unit_amount).toBe(1999);
  });

  it('builds line_items with usd currency, product metadata and quantity', async () => {
    signedIn();

    await createCheckoutSession({
      items: [
        { productId: PRODUCT_IDS.alpha, quantity: 2 },
        { productId: PRODUCT_IDS.beta, quantity: 1 },
      ],
    });

    const [params] = mockSessionsCreate.mock.calls[0];
    expect(params.line_items).toHaveLength(2);

    const [first, second] = params.line_items;
    expect(first.quantity).toBe(2);
    expect(first.price_data.currency).toBe('usd');
    expect(first.price_data.unit_amount).toBe(1999);
    expect(first.price_data.product_data.name).toBe('Checkout Alpha');
    expect(first.price_data.product_data.metadata).toEqual({
      productId: String(PRODUCT_IDS.alpha),
    });

    expect(second.quantity).toBe(1);
    expect(second.price_data.currency).toBe('usd');
    expect(second.price_data.unit_amount).toBe(500);
    expect(second.price_data.product_data.metadata).toEqual({
      productId: String(PRODUCT_IDS.beta),
    });
  });

  it('stamps the signed-in user id onto session metadata', async () => {
    signedIn();

    await createCheckoutSession({
      items: [{ productId: PRODUCT_IDS.alpha, quantity: 1 }],
    });

    const [params] = mockSessionsCreate.mock.calls[0];
    expect(params.metadata).toEqual({ userId: USER_ID });
    expect(params.customer_email).toBe('checkout-tester@niva-cart.local');
  });

  it('returns the Stripe checkout url on success', async () => {
    signedIn();

    const result = await createCheckoutSession({
      items: [{ productId: PRODUCT_IDS.alpha, quantity: 1 }],
    });

    expect(result).toEqual({
      ok: true,
      data: { url: 'https://stripe.test/session/xyz' },
    });
  });
});
