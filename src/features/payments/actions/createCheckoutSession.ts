'use server';

import { getServerSession } from 'next-auth';
import type Stripe from 'stripe';
import { authOptions } from '@/features/admin/auth/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { PRODUCT_SELECT } from '@/features/products/api/products';
import {
  getCheckoutUrls,
  getStripe,
  StripeNotConfiguredError,
} from '@/features/payments/lib/stripe';

type CartLine = { productId: number; quantity: number };

type Input = { items: CartLine[] };

type Result =
  | { ok: true; data: { url: string } }
  | { ok: false; error: string };

type ProductRow = Awaited<ReturnType<typeof findProducts>>[number];

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;
// Stripe rejects Checkout Sessions with more than 100 line items.
const MAX_LINE_ITEMS = 100;
const CURRENCY = 'usd';

function isValidLine(line: CartLine): boolean {
  return (
    Number.isInteger(line.productId) &&
    line.productId > 0 &&
    Number.isInteger(line.quantity) &&
    line.quantity >= MIN_QUANTITY &&
    line.quantity <= MAX_QUANTITY
  );
}

function hasValidLines(items: CartLine[]): boolean {
  const uniqueProductIds = new Set(items.map((line) => line.productId));
  return (
    items.length <= MAX_LINE_ITEMS &&
    uniqueProductIds.size === items.length &&
    items.every(isValidLine)
  );
}

function findProducts(productIds: number[]) {
  return prisma.product.findMany({
    where: { id: { in: productIds } },
    select: PRODUCT_SELECT,
  });
}

function buildLineItems(
  items: CartLine[],
  products: ProductRow[],
): Stripe.Checkout.SessionCreateParams.LineItem[] | null {
  const productsById = new Map(products.map((product) => [product.id, product]));

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const { productId, quantity } of items) {
    const product = productsById.get(productId);
    if (!product) return null;

    lineItems.push({
      quantity,
      price_data: {
        currency: CURRENCY,
        unit_amount: product.price,
        product_data: {
          name: product.title,
          metadata: { productId: String(product.id) },
        },
      },
    });
  }
  return lineItems;
}

export async function createCheckoutSession(input: Input): Promise<Result> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return { ok: false, error: 'Not signed in' };
  }

  const { items } = input;
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: 'Cart is empty' };
  }
  if (!hasValidLines(items)) {
    return { ok: false, error: 'Invalid cart contents' };
  }

  try {
    const products = await findProducts(items.map((line) => line.productId));
    const lineItems = buildLineItems(items, products);
    if (!lineItems) {
      return { ok: false, error: 'Some items are no longer available' };
    }

    const { successUrl, cancelUrl } = getCheckoutUrls();
    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: session.user.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId: session.user.id },
    });

    if (!checkoutSession.url) {
      return { ok: false, error: 'Checkout failed' };
    }
    return { ok: true, data: { url: checkoutSession.url } };
  } catch (error) {
    if (error instanceof StripeNotConfiguredError) {
      return {
        ok: false,
        error: 'Payments are not configured. Set STRIPE_SECRET_KEY in .env.',
      };
    }
    console.error('[checkout] failed to create Stripe session', error);
    return { ok: false, error: 'Checkout failed' };
  }
}
