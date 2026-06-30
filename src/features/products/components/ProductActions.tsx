'use client';

import { Product } from '@/features/products/types';
import { useCart } from "@/features/cart/context/CartContext";
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/cn';

interface ProductActionsProps {
  product: Product;
  variant?: 'card' | 'details';
  className?: string;
}

export default function ProductActions({ 
  product, 
  variant = 'card',
  className = "" 
}: ProductActionsProps) {
  const { addToCart, getItemQuantity, incrementQuantity, decrementQuantity, canAddToCart } = useCart();
  const cartQuantity = getItemQuantity(product.id);
  const inStock = canAddToCart(product);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleIncrement = () => {
    incrementQuantity(product.id);
  };

  const handleDecrement = () => {
    decrementQuantity(product.id);
  };

  if (variant === 'card') {
    return (
      <div className={className}>
        <p className="text-sm text-gray-500 mb-2">
          Available: {product.quantity} in stock
          {cartQuantity > 0 && (
            <span className="text-blue-600 font-medium"> | In cart: {cartQuantity}</span>
          )}
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={handleAddToCart}
          disabled={!inStock}
          className={cn(
            'w-full',
            !inStock && 'cursor-not-allowed bg-gray-400 text-gray-600 hover:bg-gray-400',
          )}
        >
          {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Available Quantity:</span>
        <span className="font-semibold">{product.quantity}</span>
      </div>

      {cartQuantity > 0 && (
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">In Cart:</span>
          <span className="font-semibold text-blue-600">{cartQuantity}</span>
        </div>
      )}

      {cartQuantity > 0 ? (
        <div className="flex items-center space-x-4" role="group" aria-label={`Quantity for ${product.title}`}>
          <Button
            type="button"
            variant="outline"
            onClick={handleDecrement}
            aria-label="Decrease quantity"
          >
            -
          </Button>
          <span className="w-8 text-center font-semibold" aria-live="polite">{cartQuantity}</span>
          <Button
            type="button"
            variant="outline"
            onClick={handleIncrement}
            aria-label="Increase quantity"
            disabled={!inStock}
          >
            +
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={handleAddToCart}
          disabled={!inStock}
          className={cn(
            'w-full',
            !inStock && 'cursor-not-allowed bg-gray-400 text-gray-600 hover:bg-gray-400',
          )}
        >
          {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      )}
    </div>
  );
}
