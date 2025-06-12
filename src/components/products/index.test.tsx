import { render, screen } from '@testing-library/react';
import Products from './index';
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
    render(<Products products={mockProducts} />);
    
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('$10.99')).toBeInTheDocument();
    expect(screen.getByText('$20.99')).toBeInTheDocument();
  });

  it('renders empty state when no products are provided', () => {
    render(<Products products={[]} />);
    
    const productElements = screen.queryAllByRole('link', { name: /Test Product/ });
    expect(productElements).toHaveLength(0);
  });

  it('renders product images with correct alt text', () => {
    render(<Products products={mockProducts} />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(mockProducts.length);
    mockProducts.forEach(product => {
      expect(screen.getByAltText(product.title)).toBeInTheDocument();
    });
  });
}); 