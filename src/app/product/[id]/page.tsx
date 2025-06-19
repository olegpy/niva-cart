import ProductDetails from "@/components/products/ProductDetails";
import { notFound } from 'next/navigation';
import { ProductResponse } from '@/types/api';

type ProductPageProps = {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  try {
    // Use the Next.js API route instead of direct external API call
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/product/${id}`, {
      cache: 'force-cache',
    });
    
    if (!response.ok) {
      notFound();
    }
    
    const result: ProductResponse = await response.json();
    
    if (!result.data) {
      notFound();
    }
    
    return <ProductDetails product={result.data} />;
  } catch (error) {
    console.error('Error in ProductPage:', error);
    notFound();
  }
} 