'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui';
import { useCart } from '@/features/cart/context/CartContext';
import { createCheckoutSession } from '@/features/payments/actions/createCheckoutSession';

export function CheckoutButton() {
  const { items } = useCart();
  const [isPending, startTransition] = useTransition();

  const disabled = items.length === 0 || isPending;

  function handleClick() {
    startTransition(async () => {
      const payload = {
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      };
      const result = await createCheckoutSession(payload);
      if (result.ok) {
        window.location.assign(result.data.url);
        return;
      }
      toast.error(result.error);
    });
  }

  return (
    <div className="flex items-end">
      <Button
        type="button"
        variant="secondary"
        size="default"
        onClick={handleClick}
        disabled={disabled}
        loading={isPending}
      >
        {isPending ? 'Redirecting…' : 'Checkout'}
      </Button>
    </div>
  );
}
