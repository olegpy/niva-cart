import { Product } from '@/types';
import { notFound } from 'next/navigation';
import ProductDetails from '@/components/products/ProductDetails';

async function getProduct(id: string): Promise<Product> {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
      next: {
        revalidate: 3600 // Cache for 1 hour
      }
    });
    if (!response.ok) {
      await notFound();
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}

type ProductPageProps = {
  params: Promise<{ id: string }>
}
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  return <ProductDetails product={product} />;
} 