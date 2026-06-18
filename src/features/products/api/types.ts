import type { ApiResponse } from '@/shared/types/api';
import type { Product } from '@/features/products/types';

export type ProductResponse = ApiResponse<Product>;
export type ProductsResponse = ApiResponse<Product[]>;
