import 'server-only';
import { getProduct } from '@/features/products/api/products';
import type { Product } from '@/features/products/types';

export const MAX_PRODUCT_ID = 2_147_483_647;

export function isValidProductId(productId: unknown): productId is number {
  return (
    typeof productId === 'number' &&
    Number.isInteger(productId) &&
    productId > 0 &&
    productId <= MAX_PRODUCT_ID
  );
}

/** `getProduct` throws for unknown ids; callers here need "missing" as a value, not an exception. */
export async function findProduct(productId: number): Promise<Product | null> {
  try {
    return await getProduct(String(productId));
  } catch {
    return null;
  }
}
