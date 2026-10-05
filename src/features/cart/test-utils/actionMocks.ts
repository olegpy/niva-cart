import type { Product } from '@/features/products/types';
import { mockCategory } from '@/shared/test-utils/product';

export function mockProduct(id: number, overrides: Partial<Product> = {}): Product {
  return {
    id,
    title: `Product ${id}`,
    price: 10 * id,
    description: `Description ${id}`,
    category: mockCategory('electronics'),
    images: [`/product-${id}.jpg`],
    thumbnail: `/product-${id}.jpg`,
    quantity: 10,
    ...overrides,
  };
}

export function randomSessionId(): string {
  return crypto.randomUUID();
}
