import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';
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
  quantity: 1
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

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', '/test-image.jpg');
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Product');
  });

  it('has working Add to Cart button', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addToCartButton).toBeEnabled();
    expect(addToCartButton).toHaveClass('bg-blue-600');
  });

  it('links to product detail page', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    const productLink = screen.getByRole('link');
    expect(productLink).toHaveAttribute('href', '/product/1');
  });

  it('renders product image with correct attributes', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Product');
  });

  it('shows available quantity', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );
    expect(screen.getByText('Available: 1 in stock')).toBeInTheDocument();
  });

  it('shows combined available and in cart info after adding to cart', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);
    expect(
      screen.getByText(
        (content, element) =>
          element?.textContent === 'Available: 1 in stock | In cart: 1'
      )
    ).toBeInTheDocument();
  });

  it('adds product to cart when Add to Cart button is clicked', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    
    // Click the Add to Cart button
    fireEvent.click(addToCartButton);
    
    // The button should now be disabled because stock is 1
    expect(addToCartButton).toBeDisabled();
    expect(addToCartButton).toHaveClass('bg-gray-400');
  });

  it('handles multiple clicks on Add to Cart button', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    
    // Click the button multiple times
    fireEvent.click(addToCartButton);
    fireEvent.click(addToCartButton);
    fireEvent.click(addToCartButton);
    
    // Button should be disabled after reaching stock limit
    expect(addToCartButton).toBeDisabled();
    expect(addToCartButton).toHaveClass('bg-gray-400');
  });

  it('renders out of stock product correctly', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockOutOfStockProduct} />
      </TestWrapper>
    );

    expect(screen.getByText('Out of Stock Product')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
    expect(screen.getByText('Available: 0 in stock')).toBeInTheDocument();
  });

  it('shows disabled button for out of stock product', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockOutOfStockProduct} />
      </TestWrapper>
    );

    const outOfStockButton = screen.getByRole('button', { name: /out of stock/i });
    expect(outOfStockButton).toBeDisabled();
    expect(outOfStockButton).toHaveClass('bg-gray-400');
    expect(outOfStockButton).toHaveClass('cursor-not-allowed');
  });

  it('does not allow adding out of stock product to cart', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockOutOfStockProduct} />
      </TestWrapper>
    );

    const outOfStockButton = screen.getByRole('button', { name: /out of stock/i });
    
    // Try to click the disabled button
    fireEvent.click(outOfStockButton);
    
    // Button should remain disabled
    expect(outOfStockButton).toBeDisabled();
    expect(outOfStockButton).toHaveClass('bg-gray-400');
  });

  it('shows correct button text based on stock status', () => {
    // Test in-stock product
    const { rerender } = render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();

    // Test out-of-stock product
    rerender(
      <TestWrapper>
        <ProductCard product={mockOutOfStockProduct} />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /out of stock/i })).toBeInTheDocument();
  });

  it('maintains product link functionality regardless of stock status', () => {
    // Test in-stock product link
    const { rerender } = render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    let productLink = screen.getByRole('link');
    expect(productLink).toHaveAttribute('href', '/product/1');

    // Test out-of-stock product link
    rerender(
      <TestWrapper>
        <ProductCard product={mockOutOfStockProduct} />
      </TestWrapper>
    );

    productLink = screen.getByRole('link');
    expect(productLink).toHaveAttribute('href', '/product/2');
  });
}); 