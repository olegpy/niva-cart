import Image from 'next/image';
import type { FavouriteProduct } from '@/features/cart/types';
import { Button } from '@/shared/components/ui';

interface FavouriteItemProps {
  item: FavouriteProduct;
  onMoveToCart: (productId: number) => void;
  isPending: boolean;
}

export function FavouriteItem({ item, onMoveToCart, isPending }: FavouriteItemProps) {
  const { productId, title, price, image } = item;

  return (
    <li className="flex items-center gap-4 rounded-lg bg-white p-4 shadow">
      <Image src={image} alt={title} width={64} height={64} className="size-16 object-contain" />
      <div className="min-w-0 flex-grow">
        <h3 className="line-clamp-2 text-base font-semibold text-gray-900">{title}</h3>
        <p className="text-sm leading-6 text-gray-600">${price.toFixed(2)}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => onMoveToCart(productId)}
        disabled={isPending}
        aria-label={`Move to Cart: ${title}`}
        className="min-h-11 shrink-0"
      >
        Move to Cart
      </Button>
    </li>
  );
}
