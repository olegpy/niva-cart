import { render, screen } from '@testing-library/react';
import Products from './index';
import { Product } from '@/types';
import { CartProvider } from '@/context/CartContext';

// Wrapper component for testing
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Test Product 1',
    price: 10.99,
    description: 'Test Description 1',
    image: '/test-image-1.jpg',
    category: 'test-category',
    quantity: 1
  },
  {
    id: 2,
    title: 'Test Product 2',
    price: 20.99,
    description: 'Test Description 2',
    image: '/test-image-2.jpg',
    category: 'test-category',
    quantity: 1
  }
];

describe('Products', () => {
  it('renders a grid of products', () => {
    render(
      <TestWrapper>
        <Products products={mockProducts} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('$10.99')).toBeInTheDocument();
    expect(screen.getByText('$20.99')).toBeInTheDocument();
  });

  it('renders empty state when no products are provided', () => {
    render(
      <TestWrapper>
        <Products products={[]} />
      </TestWrapper>
    );
    
    const productElements = screen.queryAllByRole('link', { name: /Test Product/ });
    expect(productElements).toHaveLength(0);
  });

  it('renders product images with correct alt text', () => {
    render(
      <TestWrapper>
        <Products products={mockProducts} />
      </TestWrapper>
    );
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(mockProducts.length);
    mockProducts.forEach(product => {
      expect(screen.getByAltText(product.title)).toBeInTheDocument();
    });
  });
}); 