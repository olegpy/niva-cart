import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';
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
  quantity: 1
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', '/test-image.jpg');
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Product');
  });

  it('has working Add to Cart button', () => {
    render(<ProductCard product={mockProduct} />);

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addToCartButton).toBeEnabled();
    expect(addToCartButton).toHaveClass('bg-blue-600');
  });

  it('links to product detail page', () => {
    render(<ProductCard product={mockProduct} />);

    const productLink = screen.getByRole('link');
    expect(productLink).toHaveAttribute('href', '/product/1');
  });

  it('renders product image with correct attributes', () => {
    render(<ProductCard product={mockProduct} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Product');
  });
}); 