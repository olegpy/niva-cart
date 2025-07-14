'use client';

import Link from 'next/link';
import { useState } from 'react';
import CartSummary from './cart/CartSummary';
import { useCart } from '@/context/CartContext';
import CartItem from './cart/CartItem';

export default function Header() {
  const { items } = useCart();
  const [showCartItems, setShowCartItems] = useState(false);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
              Niva Cart
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setShowCartItems(true)}
            onMouseLeave={() => setShowCartItems(false)}
          >
            <Link
              href="/cart"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
              </svg>
              <CartSummary showItemCount={true} className="font-medium" />
            </Link>
            
            {/* Cart Items Dropdown */}
            {showCartItems && items.length > 0 && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              >
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-3">Cart Items</h3>
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {items.map((item) => (
                      <CartItem key={item.product.id} item={item} compact={true} />
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <CartSummary showItemCount={false} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
