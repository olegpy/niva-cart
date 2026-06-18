import type { ProductCategory } from '@/features/products/types';

export function mockCategory(name: string): ProductCategory {
  return {
    id: 1,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    image: 'https://example.com/category.jpg',
    creationAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z',
  };
}
