import type { PrismaClient } from '@prisma/client';
import { PRODUCT_SEED_ROWS } from './products-data';

export async function seedProducts(prisma: PrismaClient) {
  for (const row of PRODUCT_SEED_ROWS) {
    await prisma.product.upsert({
      where: { id: row.id },
      update: {
        title: row.title,
        description: row.description,
        price: row.price,
        category: row.category,
        stock: row.stock,
        thumbnail: row.thumbnail,
        images: row.images,
      },
      create: row,
    });
  }

  console.log(`Seeded ${PRODUCT_SEED_ROWS.length} products`);
}
