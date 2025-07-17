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
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <Link href={`/product/${product.id}`} className="flex-1 flex flex-col">
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
        <div className="p-4 text-gray-600">
          <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
          <p>${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <div className="p-4 pt-0 mt-auto flex flex-col justify-end">
        <ProductActions product={product} variant="card" />
      </div>
    </div>
  );
}