import { render, screen } from '@testing-library/react';
import ProductDetails from './ProductDetails';
import { Product } from '@/types';
import { ImageProps } from 'next/image';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Omit<ImageProps, 'src'> & { src: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src} alt={props.alt} />;
  },
}));

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
    render(<ProductDetails product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product price correctly', () => {
    render(<ProductDetails product={mockProduct} />);
    
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('renders product category correctly', () => {
    render(<ProductDetails product={mockProduct} />);
    
    expect(screen.getByText('Category: test-category')).toBeInTheDocument();
  });

  it('renders product description correctly', () => {
    render(<ProductDetails product={mockProduct} />);
    
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders product quantity correctly', () => {
    render(<ProductDetails product={mockProduct} />);
    
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders product image with correct attributes', () => {
    render(<ProductDetails product={mockProduct} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Product');
  });

  it('renders Add to Cart button', () => {
    render(<ProductDetails product={mockProduct} />);
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addToCartButton).toBeInTheDocument();
    expect(addToCartButton).toHaveClass('bg-blue-600');
  });
}); 