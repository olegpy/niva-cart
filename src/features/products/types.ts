export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: ProductCategory;
  quantity: number;
  thumbnail: string;
}
