import 'server-only';
import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';
import type { Product } from '@/features/products/types';

export const PRODUCT_SELECT = {
  id: true,
  title: true,
  description: true,
  price: true,
  category: true,
  stock: true,
  thumbnail: true,
  images: true,
} satisfies Prisma.ProductSelect;

export type ProductRow = Prisma.ProductGetPayload<{ select: typeof PRODUCT_SELECT }>;

export function toDomain(row: ProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price / 100,
    category: row.category,
    quantity: row.stock,
    thumbnail: row.thumbnail,
    images: row.images,
  };
}

export async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    orderBy: { id: 'asc' },
    select: PRODUCT_SELECT,
  });
  return rows.map(toDomain);
}

export async function getProduct(id: string): Promise<Product> {
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid product ID: ${id}`);
  }

  const row = await prisma.product.findUnique({
    where: { id: parsed },
    select: PRODUCT_SELECT,
  });

  if (!row) {
    throw new Error(`Product with ID ${id} not found`);
  }

  return toDomain(row);
}
