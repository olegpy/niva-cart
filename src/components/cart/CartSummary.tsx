'use client';

import { useCart } from "@/context/CartContext";

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
        <span className="text-sm text-gray-600">
          {getCartCount()} item{getCartCount() !== 1 ? 's' : ''}
        </span>
      )}
      <span className="font-semibold text-lg">
        Total: ${getCartTotal().toFixed(2)}
      </span>
      {showClearButton && getCartCount() > 0 && (
        <button
          onClick={clearCart}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          aria-label="Clear cart"
        >
          Clear Cart
        </button>
      )}
    </div>
  );
} 