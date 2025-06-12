import { Product } from './models';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export type ProductsResponse = ApiResponse<Product[]>;
export type ProductResponse = ApiResponse<Product>;

export interface ApiError {
  message: string;
  status: number;
} 