'use client';

import { useCart } from "@/context/CartContext";

interface CartSummaryProps {
  showItemCount?: boolean;
  className?: string;
}

export default function CartSummary({ showItemCount = true, className = "" }: CartSummaryProps) {
  const { getCartTotal, getCartCount } = useCart();

  return (
    <span data-testid="cart-summary-container" className={`flex items-center gap-4 ${className}`}>
      {showItemCount && (
        <span className="text-sm text-gray-600">
          {getCartCount()} item{getCartCount() !== 1 ? 's' : ''}
        </span>
      )}
      <span className="font-semibold text-lg">
        Total: ${getCartTotal().toFixed(2)}
      </span>
    </span>
  );
} 