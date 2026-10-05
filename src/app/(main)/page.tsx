import Products from "@/features/products/components";
import { getProducts } from "@/features/products/api/products";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getProducts();
  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Products List</h1>
      <Products products={products} />
    </div>
  );
}
