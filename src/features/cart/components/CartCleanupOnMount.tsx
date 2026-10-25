'use client';

import { useEffect } from 'react';
import { useCart } from '@/features/cart/context/CartContext';

export function CartCleanupOnMount() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
