import type { Product } from '@/features/products/types';

export function mockProduct(id: number, overrides: Partial<Product> = {}): Product {
  return {
    id,
    title: `Product ${id}`,
    price: 10 * id,
    description: `Description ${id}`,
    category: 'electronics',
    images: [`/product-${id}.jpg`],
    thumbnail: `/product-${id}.jpg`,
    quantity: 10,
    ...overrides,
  };
}

export function randomSessionId(): string {
  return crypto.randomUUID();
}
