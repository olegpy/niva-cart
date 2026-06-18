import { notFound } from 'next/navigation';
import { getProduct } from "@/features/products/api/products";
import ProductDetails from "@/features/products/components/ProductDetails";
import type { Product } from '@/features/products/types';

type ProductPageProps = {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  let product: Product;
  try {
    product = await getProduct(id);
  } catch (error) {
    console.error('Error in ProductPage:', error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
