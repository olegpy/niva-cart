import 'server-only';
import { getStripe } from '@/features/payments/lib/stripe';

export type CheckoutPaymentStatus = 'paid' | 'unpaid' | 'unknown';

/**
 * Asks Stripe whether `sessionId` is a paid checkout session started by `userId`.
 * Anything we cannot confirm (foreign session, unknown id, Stripe error) is 'unknown'.
 */
export async function getCheckoutPaymentStatus(
  sessionId: string,
  userId: string,
): Promise<CheckoutPaymentStatus> {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.metadata?.userId !== userId) return 'unknown';
    return session.payment_status === 'unpaid' ? 'unpaid' : 'paid';
  } catch (error) {
    console.error('[checkout] failed to retrieve Stripe session', error);
    return 'unknown';
  }
}
