export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export interface FavouriteProduct {
  productId: number;
  title: string;
  price: number;
  image: string;
}
