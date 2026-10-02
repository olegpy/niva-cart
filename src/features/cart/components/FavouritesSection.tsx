'use client';

import { useMemo, useState, useTransition } from 'react';
import { moveToCart } from '@/features/cart/actions/moveToCart';
import { useCart } from '@/features/cart/context/CartContext';
import type { FavouriteProduct } from '@/features/cart/types';
import { Favourites } from './Favourites';

interface FavouritesSectionProps {
  initialItems: FavouriteProduct[];
}

export function FavouritesSection({ initialItems }: FavouritesSectionProps) {
  const { addToCart, removeFromCart } = useCart();
  const [removedIds, setRemovedIds] = useState<Set<number>>(() => new Set());
  const [prevInitialItems, setPrevInitialItems] = useState<FavouriteProduct[]>(initialItems);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Prune optimistic removals once the revalidated server list no longer contains them.
  if (prevInitialItems !== initialItems) {
    setPrevInitialItems(initialItems);
    if (removedIds.size > 0) {
      const serverIds = new Set(initialItems.map((item) => item.productId));
      let changed = false;
      const next = new Set<number>();
      for (const id of removedIds) {
        if (serverIds.has(id)) {
          next.add(id);
        } else {
          changed = true;
        }
      }
      if (changed) {
        setRemovedIds(next);
      }
    }
  }

  const items = useMemo(
    () => initialItems.filter((item) => !removedIds.has(item.productId)),
    [initialItems, removedIds],
  );

  const handleMoveToCart = (productId: number) => {
    setMoveError(null);
    setPendingId(productId);
    startTransition(async () => {
      const result = await moveToCart(productId);
      if (result.ok) {
        setRemovedIds((current) => {
          const next = new Set(current);
          next.add(productId);
          return next;
        });
        // Restore at exactly quantity 1 — strip any pre-existing cart entry before adding.
        removeFromCart(result.data.id);
        addToCart(result.data);
      } else {
        setMoveError(result.error);
      }
      setPendingId(null);
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      {moveError ? (
        <p
          role="status"
          aria-live="polite"
          data-testid="move-to-cart-error"
          className="mt-4 text-sm text-red-600"
        >
          {moveError}
        </p>
      ) : null}
      <Favourites items={items} onMoveToCart={handleMoveToCart} pendingId={pendingId} />
    </div>
  );
}
