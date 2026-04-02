import { Product } from '@/types';
import { API_BASE_URL } from '@/config/env';
import { unstable_cache } from 'next/cache';
import { normalizeProductImagesFromApi } from '@/lib/productImageUrls';

type ApiProduct = Omit<Product, 'quantity'>;

function normalizeApiProduct(product: ApiProduct): ApiProduct {
  return {
    ...product,
    images: normalizeProductImagesFromApi(product.images),
  };
}

let productsPromise: Promise<ApiProduct[]> | null = null;

export async function getProducts(): Promise<ApiProduct[]> {
  if (productsPromise) {
    return productsPromise;
  }

  productsPromise = fetch(`${API_BASE_URL}/products`, { cache: 'force-cache' })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.status}`);
      }
      return response.json() as Promise<ApiProduct[]>;
    })
    .then((data) => data.map(normalizeApiProduct));

  return productsPromise;
}

export const getProductDetails = unstable_cache(
  async (id: string): Promise<ApiProduct> => {
    if (!id) {
      throw new Error('Invalid product ID provided');
    }

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Product with ID ${id} not found`);
      }
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
    }

    const product = (await response.json()) as ApiProduct;
    return normalizeApiProduct(product);
  },
  ['product-details'],
  { revalidate: 3600 }
);

export const DEFAULT_PRODUCT_QUANTITY = 10;

export const getProduct = async (id: string): Promise<Product> => {
  try {
    const apiProduct = await getProductDetails(id);
    return {
      ...apiProduct,
      quantity: DEFAULT_PRODUCT_QUANTITY,
    };
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};
