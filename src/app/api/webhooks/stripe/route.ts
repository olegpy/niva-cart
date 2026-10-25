import { Prisma } from '@prisma/client';
import type Stripe from 'stripe';
import { prisma } from '@/shared/lib/prisma';
import { getStripe } from '@/features/payments/lib/stripe';

export const dynamic = 'force-dynamic';

// Stripe caps a Checkout Session at 100 line items.
const MAX_LINE_ITEMS = 100;

type LineItemWithProduct = Stripe.LineItem & {
  price:
    | (Stripe.Price & { product: Stripe.Product | Stripe.DeletedProduct | string })
    | null;
};

function resolveProductId(item: LineItemWithProduct): number | null {
  const product = item.price?.product;
  if (!product || typeof product !== 'object' || 'deleted' in product) return null;

  const productId = Number(product.metadata?.productId);
  return Number.isInteger(productId) && productId > 0 ? productId : null;
}

async function fetchAllLineItems(sessionId: string): Promise<LineItemWithProduct[]> {
  const lineItems = await getStripe()
    .checkout.sessions.listLineItems(sessionId, {
      limit: MAX_LINE_ITEMS,
      expand: ['data.price.product'],
    })
    .autoPagingToArray({ limit: MAX_LINE_ITEMS });
  return lineItems as LineItemWithProduct[];
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
  );
}

async function recordPaidOrder(session: Stripe.Checkout.Session): Promise<void> {
  // Delayed payment methods complete the session unpaid; the order is created
  // later by `checkout.session.async_payment_succeeded`.
  if (session.payment_status !== 'paid') return;

  const userId = session.metadata?.userId;
  if (!userId) {
    console.error('[stripe-webhook] session has no userId metadata', session.id);
    return;
  }

  const alreadyRecorded = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
    select: { id: true },
  });
  if (alreadyRecorded) return;

  const lineItems = await fetchAllLineItems(session.id);

  try {
    await prisma.order.create({
      data: {
        userId,
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === 'string' ? session.payment_intent : null,
        status: 'paid',
        total: session.amount_total ?? 0,
        currency: session.currency ?? 'usd',
        customerEmail: session.customer_details?.email ?? '',
        items: {
          create: lineItems.map((item) => ({
            productId: resolveProductId(item),
            titleSnapshot: item.description ?? '',
            price: item.price?.unit_amount ?? 0,
            quantity: item.quantity ?? 0,
          })),
        },
      },
    });
  } catch (error) {
    // A concurrent delivery of the same event already created the order.
    if (!isUniqueConstraintError(error)) throw error;
  }
}

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set');
    return new Response('Webhook not configured', { status: 500 });
  }

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch (error) {
    console.error('[stripe-webhook] Stripe client is not configured', error);
    return new Response('Webhook not configured', { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
        await recordPaidOrder(event.data.object);
        break;
    }
    return new Response('ok', { status: 200 });
  } catch (error) {
    console.error('[stripe-webhook] failed to process event', event.type, error);
    return new Response('Webhook handler failed', { status: 500 });
  }
}
