import { NextRequest, NextResponse } from 'next/server';
import { getProduct } from '@/api/products';
import { ProductResponse } from '@/types/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ProductResponse>> {
  try {
    const { id } = await params;
    
    console.log(`[API Route] Starting to fetch product with ID: ${id}`);
    console.log(`[API Route] Request headers:`, Object.fromEntries(request.headers.entries()));

    const product = await getProduct(id);
    
    console.log(`[API Route] Successfully fetched product:`, product.id);

    return NextResponse.json(
      {
        data: product,
        error: null,
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API Route] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Handle specific error types
    let status = 500;
    if (errorMessage.includes('not found')) {
      status = 404;
    } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      status = 503; // Service Unavailable instead of 401 to indicate it's a temporary issue
      console.error('[API Route] External API authentication/rate limiting issue detected');
    }
    
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
