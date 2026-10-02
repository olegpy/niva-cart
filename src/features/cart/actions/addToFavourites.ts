'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getOrCreateSessionId } from '@/features/cart/lib/cartSession';
import { findProduct, isValidProductId } from '@/features/cart/lib/findProduct';
import type { ActionResult } from '@/features/cart/types';
import type { Product } from '@/features/products/types';
import { prisma } from '@/shared/lib/prisma';

function isUniqueViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

/**
 * Customers are anonymous: the httpOnly session cookie is the identity, and it is
 * created here on first favourite. Rows are only ever written under that session.
 */
export async function addToFavourites(productId: number): Promise<ActionResult<Product>> {
  if (!isValidProductId(productId)) {
    return { ok: false, error: 'Invalid product' };
  }

  const product = await findProduct(productId);
  if (!product) {
    return { ok: false, error: 'Product not found' };
  }

  try {
    const sessionId = await getOrCreateSessionId();
    await prisma.favouriteItem.upsert({
      where: { sessionId_productId: { sessionId, productId } },
      create: { sessionId, productId },
      update: {},
    });
  } catch (error) {
    // A concurrent insert of the same product lost the race; the row exists, which is the goal.
    if (!isUniqueViolation(error)) {
      return { ok: false, error: 'Could not add to favourites' };
    }
  }

  revalidatePath('/cart');
  return { ok: true, data: product };
}
