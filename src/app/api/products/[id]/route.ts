import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';
import { API_BASE_URL } from '@/config/env';
import { unstable_cache } from 'next/cache';

const getProductDetails = unstable_cache(
  async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Product not found');
    }
    return response.json();
  },
  ['product-details'],
  { revalidate: 3600 } // Cache for 1 hour
);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data: Product = await getProductDetails(id);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }
} 