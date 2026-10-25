import 'server-only';
import Stripe from 'stripe';

export class StripeNotConfiguredError extends Error {
  readonly code = 'STRIPE_NOT_CONFIGURED';
  constructor() {
    super('STRIPE_SECRET_KEY is not set');
    this.name = 'StripeNotConfiguredError';
  }
}

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (client) return client;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new StripeNotConfiguredError();

  client = new Stripe(key, { apiVersion: '2026-09-30.endive' });
  return client;
}

export function getCheckoutUrls(): { successUrl: string; cancelUrl: string } {
  const base = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  const successUrl =
    process.env.STRIPE_CHECKOUT_SUCCESS_URL ??
    `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = process.env.STRIPE_CHECKOUT_CANCEL_URL ?? `${base}/checkout/cancel`;
  return { successUrl, cancelUrl };
}
