import { NextRequest, NextResponse } from 'next/server';
import { getProduct } from '@/api/products';
import { ProductResponse } from '@/types/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ProductResponse>> {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          data: null,
          error: 'Product ID is required',
          status: 400,
        },
        { status: 400 }
      );
    }

    const product = await getProduct(id);

    return NextResponse.json(
      {
        data: product,
        error: null,
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const status = errorMessage.includes('not found') ? 404 : 500;

    return NextResponse.json(
      {
        data: null,
        error: errorMessage,
        status,
      },
      { status }
    );
  }
}
