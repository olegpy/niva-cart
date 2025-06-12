import { Product } from '@/types';
import { API_BASE_URL } from '@/config/env';

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