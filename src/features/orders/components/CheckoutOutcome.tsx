import { CartCleanupOnMount } from '@/features/cart/components/CartCleanupOnMount';
import { getOrderByStripeSessionId } from '@/features/orders/api/orders';
import { CheckoutOutcomeLayout } from '@/features/orders/components/CheckoutOutcomeLayout';
import { OrderSummary } from '@/features/orders/components/OrderSummary';
import { PendingOrderNotice } from '@/features/orders/components/PendingOrderNotice';
import { getCheckoutPaymentStatus } from '@/features/payments/api/checkoutPayment';

const CONTINUE_SHOPPING = { href: '/', label: 'Continue shopping' };
const BACK_TO_CART = { href: '/cart', label: 'Back to cart' };

export async function CheckoutOutcome({
  sessionId,
  userId,
}: {
  sessionId: string;
  userId: string;
}) {
  const order = await getOrderByStripeSessionId(sessionId);
  if (order?.userId === userId) {
    return (
      <CheckoutOutcomeLayout title="Thank you" link={CONTINUE_SHOPPING}>
        <CartCleanupOnMount />
        <OrderSummary order={order} />
      </CheckoutOutcomeLayout>
    );
  }

  const payment = await getCheckoutPaymentStatus(sessionId, userId);

  if (payment === 'paid') {
    return (
      <CheckoutOutcomeLayout title="Thank you" link={CONTINUE_SHOPPING}>
        <CartCleanupOnMount />
        <PendingOrderNotice />
      </CheckoutOutcomeLayout>
    );
  }

  if (payment === 'unpaid') {
    return (
      <CheckoutOutcomeLayout title="Payment not completed" link={BACK_TO_CART}>
        <p className="text-sm text-gray-600">
          We have not received your payment yet. Your cart is still saved.
        </p>
      </CheckoutOutcomeLayout>
    );
  }

  return (
    <CheckoutOutcomeLayout title="Checkout" link={BACK_TO_CART}>
      <p className="text-sm text-gray-600">
        We could not find this checkout. Please return to your cart.
      </p>
    </CheckoutOutcomeLayout>
  );
}
