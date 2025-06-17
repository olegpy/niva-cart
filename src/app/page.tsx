import Products from "@/components/products";
import { DEFAULT_PRODUCT_QUANTITY, getProducts } from "@/api/products";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Products List</h1>
      <Products products={products.map(product => ({ ...product, quantity: DEFAULT_PRODUCT_QUANTITY }))} />
    </div>
  );
}
