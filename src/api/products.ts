import { Product } from '@/types';
import { API_BASE_URL } from '@/config/env';
import { unstable_cache } from 'next/cache';

// Type for the API response (without quantity)
type ApiProduct = Omit<Product, 'quantity'>;

// Fetch all products
// Create a memoized promise to ensure only one request is made
let productsPromise: Promise<ApiProduct[]> | null = null;

export async function getProducts(): Promise<ApiProduct[]> {
  // If we already have a promise, return it
  if (productsPromise) {
    return productsPromise;
  }

  // Create a new promise and store it
  productsPromise = fetch(`${API_BASE_URL}/products`, {
    cache: 'force-cache',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.status}`);
      }
      return response.json();
    });

  return productsPromise;
}

export const getProductDetails = unstable_cache(
  async (id: string): Promise<ApiProduct> => {
    if (!id) {
      throw new Error('Invalid product ID provided');
    }

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Product with ID ${id} not found`);
      }
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
  ['product-details'],
  { revalidate: 3600 } // Cache for 1 hour
);

export const DEFAULT_PRODUCT_QUANTITY = 10;
// Convenience function for getting a single product
export const getProduct = async (id: string): Promise<Product> => {
  try {
    const apiProduct = await getProductDetails(id);
    return {
      ...apiProduct,
      quantity: DEFAULT_PRODUCT_QUANTITY // Add default quantity
    };
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};
