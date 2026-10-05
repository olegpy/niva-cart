import 'server-only';
import { prisma } from '@/shared/lib/prisma';
import { PRODUCT_SELECT, toDomain } from '@/features/products/api/products';
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

export async function findProduct(productId: number): Promise<Product | null> {
  const row = await prisma.product.findUnique({
    where: { id: productId },
    select: PRODUCT_SELECT,
  });

  return row ? toDomain(row) : null;
}
