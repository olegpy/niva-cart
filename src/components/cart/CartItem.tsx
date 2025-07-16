'use client';

import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface CartItemProps {
  item: {
    product: Product;
    quantity: number;
  };
  compact?: boolean;
}

export default function CartItem({ item, compact = false }: CartItemProps) {
  const { incrementQuantity, decrementQuantity, removeFromCart, canAddToCart } = useCart();
  const { product, quantity } = item;

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
        <div className="relative w-12 h-12 flex-shrink-0">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="font-medium text-sm truncate">{product.title}</h4>
          <p className="text-gray-600 text-sm">${product.price.toFixed(2)} × {quantity}</p>
        </div>
        <div className="text-sm font-semibold">
          <span data-testid="item-total">${(product.price * quantity).toFixed(2)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
      <Link href={`/product/${product.id}`} className="relative w-24 h-24">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain"
        />
      </Link>
      <Link href={`/product/${product.id}`} className="flex-grow">
        <h3 className="font-semibold">{product.title}</h3>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
      </Link>
      <div className="flex items-center gap-2">
        <button
          onClick={() => decrementQuantity(product.id)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors cursor-pointer"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="w-8 text-center" data-testid="item-quantity">{quantity}</span>
        <button
          onClick={() => incrementQuantity(product.id)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          aria-label="Increase quantity"
          disabled={!canAddToCart(product)}
        >
          +
        </button>
      </div>
      <div className="text-sm font-semibold">
        <span data-testid="item-total">${(product.price * quantity).toFixed(2)}</span>
      </div>
      <button
        onClick={() => removeFromCart(product.id)}
        className="text-red-500 hover:text-red-700 cursor-pointer transition-colors"
        aria-label="Remove item from cart"
      >
        Remove
      </button>
    </div>
  );
} 