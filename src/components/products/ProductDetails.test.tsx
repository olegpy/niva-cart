import { render, screen, fireEvent } from '@testing-library/react';
import ProductDetails from './ProductDetails';
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
  quantity: 10
};

describe('ProductDetails', () => {
  it('renders product title correctly', () => {
    render(
      <TestWrapper>
        <ProductDetails product={mockProduct} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product price correctly', () => {
    render(
      <TestWrapper>
        <ProductDetails product={mockProduct} />
      </TestWrapper>
    );
    
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('renders product category correctly', () => {
    render(
      <TestWrapper>
        <ProductDetails product={mockProduct} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Category: test-category')).toBeInTheDocument();
  });

  it('renders product description correctly', () => {
    render(
      <TestWrapper>
        <ProductDetails product={mockProduct} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders product quantity correctly', () => {
    render(
      <TestWrapper>
        <ProductDetails product={mockProduct} />
      </TestWrapper>
    );
    
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders product image with correct attributes', () => {
    render(
      <TestWrapper>
        <ProductDetails product={mockProduct} />
      </TestWrapper>
    );
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Product');
  });

  it('renders Add to Cart button', () => {
    render(
      <TestWrapper>
        <ProductDetails product={mockProduct} />
      </TestWrapper>
    );
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addToCartButton).toBeInTheDocument();
    expect(addToCartButton).toHaveClass('bg-blue-600');
  });

  it('adds product to cart when Add to Cart button is clicked', () => {
    render(
      <TestWrapper>
        <ProductDetails product={mockProduct} />
      </TestWrapper>
    );
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    
    // Click the Add to Cart button
    fireEvent.click(addToCartButton);
    
    // Check that quantity controls appear
    expect(screen.getByText('In Cart:')).toBeInTheDocument();
    expect(screen.getByText('1', { selector: '.font-semibold.text-blue-600' })).toBeInTheDocument();
  });

  it('increments cart count when same product is added multiple times', () => {
    render(
      <TestWrapper>
        <ProductDetails product={mockProduct} />
      </TestWrapper>
    );
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    
    // Click Add to Cart button once to add to cart
    fireEvent.click(addToCartButton);
    
    // Now use the increment button to increase quantity
    const incrementButton = screen.getByRole('button', { name: /increase quantity/i });
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    
    // Check that the quantity reflects the total
    expect(screen.getByText('3', { selector: '.w-8.text-center.font-semibold' })).toBeInTheDocument();
  });

  it('handles multiple product additions correctly', () => {
    render(
      <TestWrapper>
        <ProductDetails product={mockProduct} />
      </TestWrapper>
    );
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    
    // Add product to cart
    fireEvent.click(addToCartButton);
    
    // Use increment button to add one more
    const incrementButton = screen.getByRole('button', { name: /increase quantity/i });
    fireEvent.click(incrementButton);
    
    // Check that the quantity is correct
    expect(screen.getByText('2', { selector: '.w-8.text-center.font-semibold' })).toBeInTheDocument();
  });
}); 