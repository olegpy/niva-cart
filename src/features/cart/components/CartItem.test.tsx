import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import CartItem from './CartItem';
import { Product } from '@/features/products/types';
import { mockCategory } from '@/shared/test-utils/product';
import { CartProvider, useCart } from '@/features/cart/context/CartContext';
import { addToFavourites } from '@/features/cart/actions/addToFavourites';

jest.mock('@/features/cart/actions/addToFavourites', () => ({
  addToFavourites: jest.fn(),
}));

const mockedAddToFavourites = addToFavourites as jest.MockedFunction<typeof addToFavourites>;

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'A test product description',
  category: mockCategory('electronics'),
  images: ['/test-image.jpg'],
  thumbnail: '/test-image.jpg',
  quantity: 10,
};

const mockCartItem = {
  product: mockProduct,
  quantity: 2,
};

const renderWithCartProvider = (component: React.ReactElement) => {
  return render(<CartProvider>{component}</CartProvider>);
};

describe('CartItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAddToFavourites.mockResolvedValue({ ok: true, data: mockProduct });
  });

  describe('Regular Mode (default)', () => {
    it('renders product information correctly', () => {
      renderWithCartProvider(<CartItem item={mockCartItem} />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('renders product image with correct alt text', () => {
      renderWithCartProvider(<CartItem item={mockCartItem} />);

      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('alt', 'Test Product');
    });

    it('renders quantity controls', () => {
      renderWithCartProvider(<CartItem item={mockCartItem} />);

      expect(screen.getByText('-')).toBeInTheDocument();
      expect(screen.getByText('+')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('renders remove button', () => {
      renderWithCartProvider(<CartItem item={mockCartItem} />);

      const removeButton = screen.getByRole('button', { name: 'Remove item from cart' });
      expect(removeButton).toBeInTheDocument();
      expect(removeButton).toHaveClass('text-red-500', 'hover:text-red-700', 'cursor-pointer');
    });

    it('renders an Add to favourites button beside Remove', () => {
      renderWithCartProvider(<CartItem item={mockCartItem} />);

      const favourite = screen.getByRole('button', { name: 'Add Test Product to favourites' });
      expect(favourite).toHaveTextContent('Add to favourites');
    });

    it('displays quantity in the center span', () => {
      renderWithCartProvider(<CartItem item={mockCartItem} />);

      const quantitySpan = screen.getByTestId('item-quantity');
      expect(quantitySpan).toHaveTextContent('2');
      expect(quantitySpan).toHaveClass('w-8', 'text-center');
    });

    it('handles product with zero quantity', () => {
      const cartItemWithZeroQuantity = { ...mockCartItem, quantity: 0 };
      renderWithCartProvider(<CartItem item={cartItemWithZeroQuantity} />);

      expect(screen.getByTestId('item-quantity')).toHaveTextContent('0');
    });

    it('handles product with decimal price', () => {
      const productWithDecimalPrice = { ...mockProduct, price: 19.5 };
      const cartItemWithDecimalPrice = { product: productWithDecimalPrice, quantity: 2 };
      renderWithCartProvider(<CartItem item={cartItemWithDecimalPrice} />);

      expect(screen.getByText('$19.50')).toBeInTheDocument();
    });
  });

  describe('Compact Mode', () => {
    it('renders in compact mode when compact prop is true', () => {
      renderWithCartProvider(<CartItem item={mockCartItem} compact={true} />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$29.99 × 2')).toBeInTheDocument();
      expect(screen.getByText('$59.98')).toBeInTheDocument();
    });

    it('does not show quantity controls in compact mode', () => {
      renderWithCartProvider(<CartItem item={mockCartItem} compact={true} />);

      expect(screen.queryByText('-')).not.toBeInTheDocument();
      expect(screen.queryByText('+')).not.toBeInTheDocument();
    });

    it('does not show remove button in compact mode', () => {
      renderWithCartProvider(<CartItem item={mockCartItem} compact={true} />);

      expect(screen.queryByRole('button', { name: 'Remove item from cart' })).not.toBeInTheDocument();
    });

    it('does not show add-to-favourites button in compact mode', () => {
      renderWithCartProvider(<CartItem item={mockCartItem} compact={true} />);

      expect(screen.queryByRole('button', { name: /Add .* to favourites/ })).not.toBeInTheDocument();
    });
  });

  describe('Default Behavior', () => {
    it('defaults to regular mode when compact prop is not provided', () => {
      renderWithCartProvider(<CartItem item={mockCartItem} />);

      expect(screen.getByText('-')).toBeInTheDocument();
      expect(screen.getByText('+')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Remove item from cart' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add Test Product to favourites' })).toBeInTheDocument();
    });
  });

  describe('Button Functionality', () => {
    const TestCartItem = ({ item }: { item: { product: Product; quantity: number } }) => {
      const { getCartCount, getCartTotal, addToCart, items } = useCart();
      React.useEffect(() => {
        for (let i = 0; i < item.quantity; i++) {
          addToCart(item.product);
        }
      }, [addToCart, item]);
      const currentItem = items.find((i) => i.product.id === item.product.id);
      return (
        <div>
          {currentItem && <CartItem item={currentItem} />}
          <div data-testid="cart-count">{getCartCount()}</div>
          <div data-testid="cart-total">${getCartTotal().toFixed(2)}</div>
        </div>
      );
    };

    it('increments quantity when plus button is clicked', () => {
      renderWithCartProvider(<TestCartItem item={mockCartItem} />);

      expect(screen.getByTestId('item-quantity')).toHaveTextContent('2');

      act(() => {
        fireEvent.click(screen.getByText('+'));
      });

      expect(screen.getByTestId('item-quantity')).toHaveTextContent('3');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('3');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$89.97');
    });

    it('decrements quantity when minus button is clicked', () => {
      renderWithCartProvider(<TestCartItem item={mockCartItem} />);

      act(() => {
        fireEvent.click(screen.getByText('-'));
      });

      expect(screen.getByTestId('item-quantity')).toHaveTextContent('1');
    });

    it('removes item when remove button is clicked', () => {
      renderWithCartProvider(<TestCartItem item={mockCartItem} />);

      act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Remove item from cart' }));
      });

      expect(screen.queryByTestId('item-quantity')).not.toBeInTheDocument();
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$0.00');
    });

    it('removes the item from cart when Add to favourites succeeds', async () => {
      renderWithCartProvider(<TestCartItem item={mockCartItem} />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Add Test Product to favourites' }));
      });

      await waitFor(() => {
        expect(mockedAddToFavourites).toHaveBeenCalledWith(mockProduct.id);
      });
      expect(screen.queryByTestId('item-quantity')).not.toBeInTheDocument();
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$0.00');
    });

    it('disables Add to favourites and Remove while the request is pending', async () => {
      let resolveSave: (value: { ok: true; data: Product }) => void = () => {};
      mockedAddToFavourites.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSave = resolve;
          }),
      );

      renderWithCartProvider(<TestCartItem item={mockCartItem} />);

      const saveButton = screen.getByRole('button', { name: 'Add Test Product to favourites' });
      const removeButton = screen.getByRole('button', { name: 'Remove item from cart' });

      act(() => {
        fireEvent.click(saveButton);
      });

      await waitFor(() => expect(saveButton).toBeDisabled());
      expect(removeButton).toBeDisabled();

      await act(async () => {
        resolveSave({ ok: true, data: mockProduct });
      });
    });

    it('shows the server error inline when Add to favourites fails', async () => {
      mockedAddToFavourites.mockResolvedValueOnce({ ok: false, error: 'Could not add to favourites' });

      renderWithCartProvider(<TestCartItem item={mockCartItem} />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Add Test Product to favourites' }));
      });

      await waitFor(() => {
        expect(screen.getByTestId('add-to-favourites-error')).toHaveTextContent('Could not add to favourites');
      });
      expect(screen.getByTestId('item-quantity')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
    });
  });

  describe('Accessibility', () => {
    it('has proper aria labels for buttons', () => {
      renderWithCartProvider(<CartItem item={mockCartItem} />);

      expect(screen.getByLabelText('Decrease quantity')).toBeInTheDocument();
      expect(screen.getByLabelText('Increase quantity')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove item from cart')).toBeInTheDocument();
      expect(screen.getByLabelText('Add Test Product to favourites')).toBeInTheDocument();
    });
  });
});
