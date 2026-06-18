import { Product } from '@/features/products/types';
import { API_BASE_URL } from '@/shared/config/env';
import { unstable_cache } from 'next/cache';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/features/products/lib/productImage';

type ApiProduct = Omit<Product, 'quantity'>;

type ProductsEnvelope = { products: ApiProduct[] };

/** Public fallback when API omits or empties image URLs (avoids Next/Image `src=""` warnings). */
const PLACEHOLDER_IMAGE = PRODUCT_IMAGE_PLACEHOLDER;

function listFromProductsJson(data: ProductsEnvelope | ApiProduct[]): ApiProduct[] {
    if (Array.isArray(data)) {
        return data;
    }
    if (
        data !== null &&
        typeof data === 'object' &&
        'products' in data &&
        Array.isArray((data as ProductsEnvelope).products)
    ) {
        return (data as ProductsEnvelope).products;
    }
    throw new Error(
        'Products API returned an unexpected JSON shape (expected an array or { products: [] })'
    );
}

function normalizeApiProduct(product: ApiProduct): ApiProduct {
  const rawImages = Array.isArray(product.images) ? product.images : [];
  const images = rawImages.map((u) => (typeof u === 'string' ? u.trim() : '')).filter(Boolean);
  const thumb =
    (typeof product.thumbnail === 'string' && product.thumbnail.trim()) ||
    images[0] ||
    PLACEHOLDER_IMAGE;
  const imagesOut = images.length > 0 ? images : [thumb];
  return {
    ...product,
    images: imagesOut,
    thumbnail: thumb,
  };
}

let productsPromise: Promise<ApiProduct[]> | null = null;

export async function getProducts(): Promise<ApiProduct[]> {
    if (productsPromise) {
        return productsPromise;
    }
    productsPromise = fetch(`${API_BASE_URL}/products`, { cache: 'force-cache' }).then(
        async (response) => {
            if (!response.ok) {
                throw new Error(`Error fetching products: ${response.status}`);
            }
            const data: unknown = await response.json();
            return listFromProductsJson(data as ProductsEnvelope).map(normalizeApiProduct);
        }
    );
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
