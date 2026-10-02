import type { FavouriteProduct } from '@/features/cart/types';
import { FavouriteItem } from './FavouriteItem';

interface FavouritesProps {
  items: FavouriteProduct[];
  onMoveToCart: (productId: number) => void;
  pendingId: number | null;
}

export function Favourites({ items, onMoveToCart, pendingId }: FavouritesProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="favourites-heading" className="mt-12 border-t border-gray-200 pt-8">
      <h2 id="favourites-heading" className="text-lg font-semibold text-foreground">
        Favourites ({items.length})
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-4">
        {items.map((item) => (
          <FavouriteItem
            key={item.productId}
            item={item}
            onMoveToCart={onMoveToCart}
            isPending={pendingId === item.productId}
          />
        ))}
      </ul>
    </section>
  );
}
