'use client'
import Image from 'next/image';
import { Product } from '@/types';
import ProductActions from './ProductActions';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="max-w-7xl mx-auto">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative h-[500px] w-full">
          <Image
            src={product.image}
            alt={product.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
          
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-semibold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">
              Category: {product.category}
            </span>
          </div>

          <div className="border-t border-b py-4">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <ProductActions product={product} variant="details" />
        </div>
      </div>
    </div>
  );
} 