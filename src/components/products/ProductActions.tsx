'use client';

import { Product } from '@/types';
import { useCart } from "@/context/CartContext";

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
  const { addToCart, getItemQuantity, incrementQuantity, decrementQuantity } = useCart();
  const cartQuantity = getItemQuantity(product.id);

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
        <button
          onClick={handleAddToCart}
          className={`w-full py-2 px-4 rounded transition-colors ${
            product.quantity > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
          disabled={product.quantity === 0}
        >
          {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    );
  }

  // Details variant
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
        <div className="flex items-center space-x-4">
          <button
            onClick={handleDecrement}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="w-8 text-center font-semibold">{cartQuantity}</span>
          <button
            onClick={handleIncrement}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            aria-label="Increase quantity"
            disabled={cartQuantity >= product.quantity}
          >
            +
          </button>
        </div>
      ) : (
        <button
          className={`w-full py-3 px-6 rounded-lg transition-colors ${
            product.quantity > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
          onClick={handleAddToCart}
          disabled={product.quantity === 0}
        >
          {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      )}
    </div>
  );
} 