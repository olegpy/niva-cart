'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import ProductActions from './ProductActions';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={product.image}
            alt={product.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
          <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mb-2">
            Available: {product.quantity} in stock
          </p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <ProductActions product={product} variant="card" />
      </div>
    </div>
  );
}