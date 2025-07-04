import { render, screen, fireEvent } from '@testing-library/react';
import ProductActions from './ProductActions';
import { Product } from '@/types';
import { CartProvider } from '@/context/CartContext';

// Wrapper component for testing
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  description: 'Test Description',
  image: '/test-image.jpg',
  category: 'test-category',
  quantity: 5
};

const mockOutOfStockProduct: Product = {
  id: 2,
  title: 'Out of Stock Product',
  price: 49.99,
  description: 'Out of Stock Description',
  image: '/out-of-stock-image.jpg',
  category: 'test-category',
  quantity: 0
};

describe(ProductActions.name, () => {
  describe('Card variant', () => {
    it('renders Add to Cart button for in-stock product', () => {
      render(
        <TestWrapper>
          <ProductActions product={mockProduct} variant="card" />
        </TestWrapper>
      );

      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      expect(addToCartButton).toBeInTheDocument();
      expect(addToCartButton).toBeEnabled();
      expect(addToCartButton).toHaveClass('bg-blue-600');
    });

    it('renders Out of Stock button for out-of-stock product', () => {
      render(
        <TestWrapper>
          <ProductActions product={mockOutOfStockProduct} variant="card" />
        </TestWrapper>
      );

      const outOfStockButton = screen.getByRole('button', { name: /out of stock/i });
      expect(outOfStockButton).toBeInTheDocument();
      expect(outOfStockButton).toBeDisabled();
      expect(outOfStockButton).toHaveClass('bg-gray-400');
      expect(outOfStockButton).toHaveClass('cursor-not-allowed');
    });

    it('shows cart quantity when product is in cart', () => {
      render(
        <TestWrapper>
          <ProductActions product={mockProduct} variant="card" />
        </TestWrapper>
      );

      // Add product to cart first
      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      fireEvent.click(addToCartButton);

      // Should show combined line (even if split across elements)
      expect(
        screen.getByText(
          (content, element) =>
            element?.textContent === 'Available: 5 in stock | In cart: 1'
        )
      ).toBeInTheDocument();
    });

    it('handles multiple clicks on Add to Cart button', () => {
      render(
        <TestWrapper>
          <ProductActions product={mockProduct} variant="card" />
        </TestWrapper>
      );

      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      // Click multiple times
      fireEvent.click(addToCartButton);
      fireEvent.click(addToCartButton);
      fireEvent.click(addToCartButton);

      // Should show updated combined line (even if split across elements)
      expect(
        screen.getByText(
          (content, element) =>
            element?.textContent === 'Available: 5 in stock | In cart: 3'
        )
      ).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <TestWrapper>
          <ProductActions product={mockProduct} variant="card" className="custom-class" />
        </TestWrapper>
      );

      const container = screen.getByRole('button', { name: /add to cart/i }).parentElement;
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Details variant', () => {
    it('renders available quantity information', () => {
      render(
        <TestWrapper>
          <ProductActions product={mockProduct} variant="details" />
        </TestWrapper>
      );

      expect(screen.getByText('Available Quantity:')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders Add to Cart button when product is not in cart', () => {
      render(
        <TestWrapper>
          <ProductActions product={mockProduct} variant="details" />
        </TestWrapper>
      );

      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      expect(addToCartButton).toBeInTheDocument();
      expect(addToCartButton).toBeEnabled();
      expect(addToCartButton).toHaveClass('bg-blue-600');
    });

    it('renders Out of Stock button for out-of-stock product', () => {
      render(
        <TestWrapper>
          <ProductActions product={mockOutOfStockProduct} variant="details" />
        </TestWrapper>
      );

      const outOfStockButton = screen.getByRole('button', { name: /out of stock/i });
      expect(outOfStockButton).toBeInTheDocument();
      expect(outOfStockButton).toBeDisabled();
      expect(outOfStockButton).toHaveClass('bg-gray-400');
    });

    it('shows quantity controls when product is in cart', () => {
      render(
        <TestWrapper>
          <ProductActions product={mockProduct} variant="details" />
        </TestWrapper>
      );

      // Add product to cart first
      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      fireEvent.click(addToCartButton);

      // Should show quantity controls
      expect(screen.getByText('In Cart:')).toBeInTheDocument();
      expect(screen.getByText('1', { selector: 'span.font-semibold.text-blue-600' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /decrease quantity/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /increase quantity/i })).toBeInTheDocument();
    });

    it('increments quantity when + button is clicked', () => {
      render(
        <TestWrapper>
          <ProductActions product={mockProduct} variant="details" />
        </TestWrapper>
      );

      // Add product to cart first
      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      fireEvent.click(addToCartButton);

      // Click increment button
      const incrementButton = screen.getByRole('button', { name: /increase quantity/i });
      fireEvent.click(incrementButton);

      // Should show updated quantity
      expect(screen.getByText('2', { selector: 'span.font-semibold.text-blue-600' })).toBeInTheDocument();
    });

    it('decrements quantity when - button is clicked', () => {
      render(
        <TestWrapper>
          <ProductActions product={mockProduct} variant="details" />
        </TestWrapper>
      );

      // Add product to cart first
      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      fireEvent.click(addToCartButton);

      // Add one more to have quantity 2
      const incrementButton = screen.getByRole('button', { name: /increase quantity/i });
      fireEvent.click(incrementButton);

      // Click decrement button
      const decrementButton = screen.getByRole('button', { name: /decrease quantity/i });
      fireEvent.click(decrementButton);

      // Should show updated quantity
      expect(screen.getByText('1', { selector: 'span.font-semibold.text-blue-600' })).toBeInTheDocument();
    });

    it('removes product from cart when quantity reaches 0', () => {
      render(
        <TestWrapper>
          <ProductActions product={mockProduct} variant="details" />
        </TestWrapper>
      );

      // Add product to cart first
      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      fireEvent.click(addToCartButton);

      // Click decrement button to remove from cart
      const decrementButton = screen.getByRole('button', { name: /decrease quantity/i });
      fireEvent.click(decrementButton);

      // Should show Add to Cart button again
      expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
      expect(screen.queryByText('In Cart:')).not.toBeInTheDocument();
    });

    it('disables increment button when quantity reaches available stock', () => {
      render(
        <TestWrapper>
          <ProductActions product={mockProduct} variant="details" />
        </TestWrapper>
      );

      // Add product to cart first
      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      fireEvent.click(addToCartButton);

      // Increment to max quantity (5)
      const incrementButton = screen.getByRole('button', { name: /increase quantity/i });
      fireEvent.click(incrementButton); // 2
      fireEvent.click(incrementButton); // 3
      fireEvent.click(incrementButton); // 4
      fireEvent.click(incrementButton); // 5

      // Increment button should be disabled
      expect(incrementButton).toBeDisabled();
    });

    it('applies custom className to details variant', () => {
      render(
        <TestWrapper>
          <ProductActions product={mockProduct} variant="details" className="custom-details-class" />
        </TestWrapper>
      );

      const container = screen.getByText('Available Quantity:').closest('div')?.parentElement;
      expect(container).toHaveClass('custom-details-class');
    });
  });

  describe('Default variant (card)', () => {
    it('renders card variant by default', () => {
      render(
        <TestWrapper>
          <ProductActions product={mockProduct} />
        </TestWrapper>
      );

      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      expect(addToCartButton).toBeInTheDocument();
      expect(addToCartButton).toHaveClass('w-full');
    });
  });

  describe('Edge cases', () => {
    it('handles product with quantity 1 correctly', () => {
      const singleQuantityProduct = { ...mockProduct, quantity: 1 };
      
      render(
        <TestWrapper>
          <ProductActions product={singleQuantityProduct} variant="details" />
        </TestWrapper>
      );

      // Add to cart
      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      fireEvent.click(addToCartButton);

      // Increment button should be disabled after adding
      const incrementButton = screen.getByRole('button', { name: /increase quantity/i });
      expect(incrementButton).toBeDisabled();
    });

    it('handles rapid clicks correctly', () => {
      render(
        <TestWrapper>
          <ProductActions product={mockProduct} variant="details" />
        </TestWrapper>
      );

      // Add to cart
      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      fireEvent.click(addToCartButton);

      // Rapid increment clicks
      const incrementButton = screen.getByRole('button', { name: /increase quantity/i });
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      // Should handle rapid clicks gracefully
      expect(screen.getByText('4', { selector: 'span.font-semibold.text-blue-600' })).toBeInTheDocument();
    });
  });
}); 