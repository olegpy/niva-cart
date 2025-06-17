import { notFound } from 'next/navigation';
import { getProduct } from "@/api";
import ProductDetails from "@/components/products/ProductDetails";

type ProductPageProps = {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  try {
    const product = await getProduct(id);
    if (!product) {
      notFound();
    }
    return <ProductDetails product={product} />;
  } catch (error) {
    console.error('Error in ProductPage:', error);
    notFound();
  }
} 