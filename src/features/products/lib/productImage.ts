import type { Product } from '@/features/products/types';

/** Matches `PLACEHOLDER_IMAGE` in `@/features/products/api/products` — public asset, always a non-empty local URL. */
export const PRODUCT_IMAGE_PLACEHOLDER = '/file.svg';

/** Safe `next/image` `src` for cart / client paths (API-normalized products should already be filled). */
export function productImageSrc(product: Pick<Product, 'thumbnail' | 'images'>): string {
  const t = product.thumbnail?.trim();
  if (t) return t;
  const first = product.images?.find((u) => typeof u === 'string' && u.trim());
  if (first) return first.trim();
  return PRODUCT_IMAGE_PLACEHOLDER;
}
