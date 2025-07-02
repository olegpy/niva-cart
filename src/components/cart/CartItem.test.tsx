import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CartItem from './CartItem';
import { Product } from '@/types';
import { CartProvider, useCart } from '@/context/CartContext';

// Mock product data
const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'A test product description',
  category: 'electronics',
  image: '/test-image.jpg',
  quantity: 2
};

// Helper function to render with CartProvider
const renderWithCartProvider = (component: React.ReactElement) => {
  return render(
    <CartProvider>
      {component}
    </CartProvider>
  );
};

describe('CartItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Regular Mode (default)', () => {
    it('renders product information correctly', () => {
      renderWithCartProvider(<CartItem item={mockProduct} />);
      
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('renders product image with correct alt text', () => {
      renderWithCartProvider(<CartItem item={mockProduct} />);
      
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('alt', 'Test Product');
    });

    it('renders quantity controls', () => {
      renderWithCartProvider(<CartItem item={mockProduct} />);
      
      expect(screen.getByText('-')).toBeInTheDocument();
      expect(screen.getByText('+')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('renders remove button', () => {
      renderWithCartProvider(<CartItem item={mockProduct} />);
      
      const removeButton = screen.getByText('Remove');
      expect(removeButton).toBeInTheDocument();
      expect(removeButton).toHaveClass('text-red-500', 'hover:text-red-700', 'cursor-pointer');
    });

    it('has correct styling classes', () => {
      renderWithCartProvider(<CartItem item={mockProduct} />);
      
      const container = screen.getByText('Test Product').parentElement?.parentElement;
      expect(container).toHaveClass('flex', 'items-center', 'gap-4', 'bg-white', 'p-4', 'rounded-lg', 'shadow');
    });

    it('displays quantity in the center span', () => {
      renderWithCartProvider(<CartItem item={mockProduct} />);
      
      const quantitySpan = screen.getByText('2');
      expect(quantitySpan).toHaveClass('w-8', 'text-center');
    });

    it('renders buttons with correct styling', () => {
      renderWithCartProvider(<CartItem item={mockProduct} />);
      
      const minusButton = screen.getByText('-');
      const plusButton = screen.getByText('+');
      
      expect(minusButton).toHaveClass('px-2', 'py-1', 'bg-gray-200', 'rounded', 'hover:bg-gray-300');
      expect(plusButton).toHaveClass('px-2', 'py-1', 'bg-gray-200', 'rounded', 'hover:bg-gray-300');
    });

    it('handles product with zero quantity', () => {
      const productWithZeroQuantity = { ...mockProduct, quantity: 0 };
      renderWithCartProvider(<CartItem item={productWithZeroQuantity} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles product with decimal price', () => {
      const productWithDecimalPrice = { ...mockProduct, price: 19.50 };
      renderWithCartProvider(<CartItem item={productWithDecimalPrice} />);
      
      expect(screen.getByText('$19.50')).toBeInTheDocument();
    });

    it('handles product with long title', () => {
      const productWithLongTitle = { 
        ...mockProduct, 
        title: 'This is a very long product title that might wrap to multiple lines' 
      };
      renderWithCartProvider(<CartItem item={productWithLongTitle} />);
      
      expect(screen.getByText('This is a very long product title that might wrap to multiple lines')).toBeInTheDocument();
    });
  });

  describe('Compact Mode', () => {
    it('renders in compact mode when compact prop is true', () => {
      renderWithCartProvider(<CartItem item={mockProduct} compact={true} />);
      
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$29.99 × 2')).toBeInTheDocument();
      expect(screen.getByText('$59.98')).toBeInTheDocument(); // Total for this item
    });

    it('has compact styling classes', () => {
      renderWithCartProvider(<CartItem item={mockProduct} compact={true} />);
      
      const container = screen.getByText('Test Product').parentElement?.parentElement;
      expect(container).toHaveClass('flex', 'items-center', 'gap-3', 'bg-gray-50', 'p-3', 'rounded-lg');
    });

    it('shows smaller image in compact mode', () => {
      renderWithCartProvider(<CartItem item={mockProduct} compact={true} />);
      
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('alt', 'Test Product');
      
      // Check that the image container has compact sizing
      const imageContainer = image.parentElement;
      expect(imageContainer).toHaveClass('w-12', 'h-12', 'flex-shrink-0');
    });

    it('displays price and quantity in compact format', () => {
      renderWithCartProvider(<CartItem item={mockProduct} compact={true} />);
      
      expect(screen.getByText('$29.99 × 2')).toBeInTheDocument();
      expect(screen.getByText('$59.98')).toBeInTheDocument();
    });

    it('does not show quantity controls in compact mode', () => {
      renderWithCartProvider(<CartItem item={mockProduct} compact={true} />);
      
      expect(screen.queryByText('-')).not.toBeInTheDocument();
      expect(screen.queryByText('+')).not.toBeInTheDocument();
    });

    it('does not show remove button in compact mode', () => {
      renderWithCartProvider(<CartItem item={mockProduct} compact={true} />);
      
      expect(screen.queryByText('Remove')).not.toBeInTheDocument();
    });

    it('handles product with single quantity in compact mode', () => {
      const singleQuantityProduct = { ...mockProduct, quantity: 1 };
      renderWithCartProvider(<CartItem item={singleQuantityProduct} compact={true} />);
      
      expect(screen.getByText('$29.99 × 1')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });

    it('handles product with zero quantity in compact mode', () => {
      const productWithZeroQuantity = { ...mockProduct, quantity: 0 };
      renderWithCartProvider(<CartItem item={productWithZeroQuantity} compact={true} />);
      
      expect(screen.getByText('$29.99 × 0')).toBeInTheDocument();
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('truncates long titles in compact mode', () => {
      const productWithLongTitle = { 
        ...mockProduct, 
        title: 'This is a very long product title that should be truncated in compact mode' 
      };
      renderWithCartProvider(<CartItem item={productWithLongTitle} compact={true} />);
      
      expect(screen.getByText('This is a very long product title that should be truncated in compact mode')).toBeInTheDocument();
      
      // Check that the title container has truncate class
      const titleElement = screen.getByText('This is a very long product title that should be truncated in compact mode');
      expect(titleElement).toHaveClass('truncate');
    });
  });

  describe('Default Behavior', () => {
    it('defaults to regular mode when compact prop is not provided', () => {
      renderWithCartProvider(<CartItem item={mockProduct} />);
      
      // Should show quantity controls and remove button (regular mode)
      expect(screen.getByText('-')).toBeInTheDocument();
      expect(screen.getByText('+')).toBeInTheDocument();
      expect(screen.getByText('Remove')).toBeInTheDocument();
    });

    it('defaults to regular mode when compact prop is false', () => {
      renderWithCartProvider(<CartItem item={mockProduct} compact={false} />);
      
      // Should show quantity controls and remove button (regular mode)
      expect(screen.getByText('-')).toBeInTheDocument();
      expect(screen.getByText('+')).toBeInTheDocument();
      expect(screen.getByText('Remove')).toBeInTheDocument();
    });
  });

  describe('Button Functionality', () => {
    // Test component to verify cart state changes
    const TestCartItem = ({ item }: { item: Product }) => {
      const { getCartCount, getCartTotal, addToCart, items } = useCart();
      React.useEffect(() => {
        for (let i = 0; i < item.quantity; i++) {
          addToCart({ ...item, quantity: 1 });
        }
      }, [addToCart, item]);
      const currentItem = items.find((i) => i.id === item.id);
      return (
        <div>
          {currentItem && <CartItem item={currentItem} />}
          <div data-testid="cart-count">{getCartCount()}</div>
          <div data-testid="cart-total">${getCartTotal().toFixed(2)}</div>
        </div>
      );
    };

    it('increments quantity when plus button is clicked', () => {
      renderWithCartProvider(<TestCartItem item={mockProduct} />);
      
      // Initial state
      expect(screen.getByTestId('item-quantity')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$59.98');
      
      // Click increment button
      const plusButton = screen.getByText('+');
      
      act(() => {
        fireEvent.click(plusButton);
      });
      
      // Verify quantity increased
      expect(screen.getByTestId('item-quantity')).toHaveTextContent('3');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('3');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$89.97');
    });

    it('decrements quantity when minus button is clicked', () => {
      renderWithCartProvider(<TestCartItem item={mockProduct} />);
      
      // Initial state
      expect(screen.getByTestId('item-quantity')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$59.98');
      
      // Click decrement button
      const minusButton = screen.getByText('-');
      
      act(() => {
        fireEvent.click(minusButton);
      });
      
      // Verify quantity decreased
      expect(screen.getByTestId('item-quantity')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$29.99');
    });

    it('removes item when decrementing from quantity 1', () => {
      const singleQuantityProduct = { ...mockProduct, quantity: 1 };
      renderWithCartProvider(<TestCartItem item={singleQuantityProduct} />);
      
      // Initial state
      expect(screen.getByTestId('item-quantity')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$29.99');
      
      // Click decrement button
      const minusButton = screen.getByText('-');
      
      act(() => {
        fireEvent.click(minusButton);
      });
      
      // Verify item is removed
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$0.00');
      // The CartItem component should no longer be rendered
      expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
    });

    it('removes item when remove button is clicked', () => {
      renderWithCartProvider(<TestCartItem item={mockProduct} />);
      
      // Initial state
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$59.98');
      
      // Click remove button
      const removeButton = screen.getByText('Remove');
      
      act(() => {
        fireEvent.click(removeButton);
      });
      
      // Verify item is removed
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$0.00');
      expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
    });

    it('handles multiple increment clicks', () => {
      renderWithCartProvider(<TestCartItem item={mockProduct} />);
      
      // Initial state
      expect(screen.getByTestId('item-quantity')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
      
      // Click increment button multiple times
      const plusButton = screen.getByText('+');
      
      act(() => {
        fireEvent.click(plusButton);
        fireEvent.click(plusButton);
        fireEvent.click(plusButton);
      });
      
      // Verify quantity increased to 5
      expect(screen.getByTestId('item-quantity')).toHaveTextContent('5');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('5');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$149.95');
    });

    it('handles multiple decrement clicks', () => {
      const highQuantityProduct = { ...mockProduct, quantity: 5 };
      renderWithCartProvider(<TestCartItem item={highQuantityProduct} />);
      
      // Initial state
      expect(screen.getByTestId('item-quantity')).toHaveTextContent('5');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('5');
      
      // Click decrement button multiple times
      const minusButton = screen.getByText('-');
      
      act(() => {
        fireEvent.click(minusButton);
        fireEvent.click(minusButton);
        fireEvent.click(minusButton);
      });
      
      // Verify quantity decreased to 2
      expect(screen.getByTestId('item-quantity')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$59.98');
    });

    it('has correct aria labels for accessibility', () => {
      renderWithCartProvider(<CartItem item={mockProduct} />);
      
      const minusButton = screen.getByText('-');
      const plusButton = screen.getByText('+');
      const removeButton = screen.getByText('Remove');
      
      expect(minusButton).toHaveAttribute('aria-label', 'Decrease quantity');
      expect(plusButton).toHaveAttribute('aria-label', 'Increase quantity');
      expect(removeButton).toHaveAttribute('aria-label', 'Remove item from cart');
    });
  });
}); 