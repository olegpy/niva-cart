'use server';

import { revalidatePath } from 'next/cache';
import { getSessionId } from '@/features/cart/lib/cartSession';
import { findProduct, isValidProductId } from '@/features/cart/lib/findProduct';
import type { ActionResult } from '@/features/cart/types';
import type { Product } from '@/features/products/types';
import { prisma } from '@/shared/lib/prisma';

export async function moveToCart(productId: number): Promise<ActionResult<Product>> {
  const sessionId = await getSessionId();
  if (!sessionId) {
    return { ok: false, error: 'No session' };
  }

  if (!isValidProductId(productId)) {
    return { ok: false, error: 'Invalid product' };
  }

  try {
    const favourite = await prisma.favouriteItem.findUnique({
      where: { sessionId_productId: { sessionId, productId } },
      select: { id: true },
    });
    if (!favourite) {
      return { ok: false, error: 'Not a favourite' };
    }

    const product = await findProduct(productId);
    if (!product) {
      return { ok: false, error: 'Product not found' };
    }

    const { count } = await prisma.favouriteItem.deleteMany({
      where: { sessionId, productId },
    });
    if (count === 0) {
      return { ok: false, error: 'Not a favourite' };
    }

    revalidatePath('/cart');
    return { ok: true, data: product };
  } catch {
    return { ok: false, error: 'Could not move item to cart' };
  }
}
