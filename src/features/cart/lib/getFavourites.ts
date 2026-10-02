import 'server-only';
import { getSessionId } from '@/features/cart/lib/cartSession';
import { findProduct } from '@/features/cart/lib/findProduct';
import type { FavouriteProduct } from '@/features/cart/types';
import { productImageSrc } from '@/features/products/lib/productImage';
import { prisma } from '@/shared/lib/prisma';

export const MAX_FAVOURITES = 50;

export interface FavouriteItemView extends FavouriteProduct {
  id: number;
  createdAt: Date;
}

export async function getFavourites(): Promise<FavouriteItemView[]> {
  const sessionId = await getSessionId();
  if (!sessionId) {
    return [];
  }

  const rows = await prisma.favouriteItem.findMany({
    where: { sessionId },
    select: { id: true, productId: true, createdAt: true },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: MAX_FAVOURITES,
  });

  const withProducts = await Promise.all(
    rows.map(async (row) => ({ row, product: await findProduct(row.productId) })),
  );

  return withProducts.flatMap(({ row, product }) =>
    product
      ? [
          {
            ...row,
            title: product.title,
            price: product.price,
            image: productImageSrc(product),
          },
        ]
      : [],
  );
}
