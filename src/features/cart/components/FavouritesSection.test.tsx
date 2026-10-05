import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '@/features/cart/context/CartContext';
import { moveToCart } from '@/features/cart/actions/moveToCart';
import type { Product } from '@/features/products/types';
import type { FavouriteProduct } from '@/features/cart/types';
import { FavouritesSection } from './FavouritesSection';

jest.mock('@/features/cart/actions/moveToCart', () => ({
  moveToCart: jest.fn(),
}));

const mockedMoveToCart = moveToCart as jest.MockedFunction<typeof moveToCart>;

const lamp: Product = {
  id: 1,
  title: 'Desk Lamp',
  price: 24.5,
  description: 'A desk lamp',
  category: 'home',
  images: ['/lamp.jpg'],
  thumbnail: '/lamp.jpg',
  quantity: 10,
};

const favouriteLamp: FavouriteProduct = {
  productId: lamp.id,
  title: lamp.title,
  price: lamp.price,
  image: '/lamp.jpg',
};

function CartSpy() {
  const { items } = useCart();
  const row = items[0];
  return (
    <div data-testid="cart-spy">
      {row ? `${row.product.title}:${row.quantity}` : 'empty'}
    </div>
  );
}

function Harness({
  initial,
  seed,
}: {
  initial: FavouriteProduct[];
  seed?: { product: Product; quantity: number };
}) {
  return (
    <CartProvider>
      {seed ? <Seeder product={seed.product} quantity={seed.quantity} /> : null}
      <FavouritesSection initialItems={initial} />
      <CartSpy />
    </CartProvider>
  );
}

function Seeder({ product, quantity }: { product: Product; quantity: number }) {
  const { addToCart } = useCart();
  React.useEffect(() => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  }, [addToCart, product, quantity]);
  return null;
}

describe('FavouritesSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when there are no favourites', () => {
    const { container } = render(<Harness initial={[]} />);

    expect(container.querySelector('section')).toBeNull();
  });

  it('passes a pending id through while the move request is in flight', async () => {
    let resolveMove: (value: { ok: true; data: Product }) => void = () => {};
    mockedMoveToCart.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveMove = resolve;
        }),
    );

    render(<Harness initial={[favouriteLamp]} />);

    const button = screen.getByRole('button', { name: 'Move to Cart: Desk Lamp' });
    await userEvent.click(button);

    await waitFor(() => expect(button).toBeDisabled());

    resolveMove({ ok: true, data: lamp });
    await waitFor(() => expect(screen.queryByRole('listitem')).not.toBeInTheDocument());
  });

  it('removes the favourite and adds the product to the cart on success', async () => {
    mockedMoveToCart.mockResolvedValueOnce({ ok: true, data: lamp });

    render(<Harness initial={[favouriteLamp]} />);

    await userEvent.click(screen.getByRole('button', { name: 'Move to Cart: Desk Lamp' }));

    await waitFor(() => expect(mockedMoveToCart).toHaveBeenCalledWith(1));
    await waitFor(() => expect(screen.getByTestId('cart-spy')).toHaveTextContent('Desk Lamp:1'));
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('restores the product at quantity 1 even when it was already in cart at a higher quantity', async () => {
    mockedMoveToCart.mockResolvedValueOnce({ ok: true, data: lamp });

    render(<Harness initial={[favouriteLamp]} seed={{ product: lamp, quantity: 3 }} />);

    await waitFor(() => expect(screen.getByTestId('cart-spy')).toHaveTextContent('Desk Lamp:3'));

    await userEvent.click(screen.getByRole('button', { name: 'Move to Cart: Desk Lamp' }));

    await waitFor(() => expect(screen.getByTestId('cart-spy')).toHaveTextContent('Desk Lamp:1'));
  });

  it('keeps the favourite and surfaces the error when the server rejects the move', async () => {
    mockedMoveToCart.mockResolvedValueOnce({ ok: false, error: 'Not a favourite' });

    render(<Harness initial={[favouriteLamp]} />);

    await userEvent.click(screen.getByRole('button', { name: 'Move to Cart: Desk Lamp' }));

    await waitFor(() => {
      expect(screen.getByTestId('move-to-cart-error')).toHaveTextContent('Not a favourite');
    });
    expect(screen.getByRole('button', { name: 'Move to Cart: Desk Lamp' })).toBeInTheDocument();
    expect(screen.getByTestId('cart-spy')).toHaveTextContent('empty');
  });

  it('reveals the section when the server component delivers new favourites', () => {
    const { rerender } = render(<Harness initial={[]} />);

    expect(screen.queryByRole('heading', { level: 2, name: /Favourites/ })).not.toBeInTheDocument();

    rerender(<Harness initial={[favouriteLamp]} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Favourites (1)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move to Cart: Desk Lamp' })).toBeInTheDocument();
  });

  it('hides the section when the server component delivers an empty list after a prior render', () => {
    const { rerender } = render(<Harness initial={[favouriteLamp]} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Favourites (1)' })).toBeInTheDocument();

    rerender(<Harness initial={[]} />);

    expect(screen.queryByRole('heading', { level: 2, name: /Favourites/ })).not.toBeInTheDocument();
  });
});
