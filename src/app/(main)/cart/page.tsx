import CartItems from '@/features/cart/components/CartItems';
import { FavouritesSection } from '@/features/cart/components/FavouritesSection';
import { getFavourites } from '@/features/cart/lib/getFavourites';
import type { FavouriteProduct } from '@/features/cart/types';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const favourites = await getFavourites();
  const initialItems: FavouriteProduct[] = favourites.map((row) => ({
    productId: row.productId,
    title: row.title,
    price: row.price,
    image: row.image,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <CartItems />
      <FavouritesSection initialItems={initialItems} />
    </div>
  );
}
