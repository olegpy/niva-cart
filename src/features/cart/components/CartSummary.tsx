'use client';

import { useCart } from "@/features/cart/context/CartContext";
import { Button } from '@/shared/components/ui/button';

interface CartSummaryProps {
  showItemCount?: boolean;
  showClearButton?: boolean;
  className?: string;
}

export default function CartSummary({ 
  showItemCount = true, 
  showClearButton = false,
  className = "" 
}: CartSummaryProps) {
  const { getCartTotal, getCartCount, clearCart } = useCart();

  return (
    <div data-testid="cart-summary-container" className={`flex items-center gap-4 ${className}`}>
      {showItemCount && (
        <span className={`text-sm text-gray-600 ${showClearButton && 'dark:text-gray-50'}`}>
          {getCartCount()} item{getCartCount() !== 1 ? 's' : ''}
        </span>
      )}
      <span className="font-semibold text-lg">
        Total: ${getCartTotal().toFixed(2)}
      </span>
      {showClearButton && getCartCount() > 0 && (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={clearCart}
          aria-label="Clear cart"
        >
          Clear Cart
        </Button>
      )}
    </div>
  );
}
