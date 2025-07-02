'use client';

import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface CartItemProps {
  item: Product;
  compact?: boolean;
}

export default function CartItem({ item, compact = false }: CartItemProps) {
  const { incrementQuantity, decrementQuantity, removeFromCart } = useCart();

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
        <div className="relative w-12 h-12 flex-shrink-0">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="font-medium text-sm truncate">{item.title}</h4>
          <p className="text-gray-600 text-sm">${item.price.toFixed(2)} × {item.quantity}</p>
        </div>
        <div className="text-sm font-semibold">
          ${(item.price * item.quantity).toFixed(2)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
      <div className="relative w-24 h-24">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-contain"
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-gray-600">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => decrementQuantity(item.id)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="w-8 text-center" data-testid="item-quantity">{item.quantity}</span>
        <button
          onClick={() => incrementQuantity(item.id)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-500 hover:text-red-700 cursor-pointer transition-colors"
        aria-label="Remove item from cart"
      >
        Remove
      </button>
    </div>
  );
} 