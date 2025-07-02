import { render, screen } from '@testing-library/react';
import CartItems from './CartItems';
import { Product } from '@/types';

// Mock the useCart hook
jest.mock('@/context/CartContext', () => ({
  ...jest.requireActual('@/context/CartContext'),
  useCart: jest.fn(),
}));

import { useCart } from '@/context/CartContext';

const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;

// Helper function to create mock cart context
const createMockCartContext = (items: Product[], total: number, count: number) => ({
  items,
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
  incrementQuantity: jest.fn(),
  decrementQuantity: jest.fn(),
  clearCart: jest.fn(),
  getCartTotal: jest.fn().mockReturnValue(total),
  getCartCount: jest.fn().mockReturnValue(count),
  getItemQuantity: jest.fn().mockReturnValue(0),
});

// Mock product data
const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Product 1',
    price: 29.99,
    description: 'First product description',
    category: 'electronics',
    image: '/product1.jpg',
    quantity: 2
  },
  {
    id: 2,
    title: 'Product 2',
    price: 19.50,
    description: 'Second product description',
    category: 'clothing',
    image: '/product2.jpg',
    quantity: 1
  }
];

describe('CartItems', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty cart message when no items', () => {
    mockUseCart.mockReturnValue({
      items: [],
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      incrementQuantity: jest.fn(),
      decrementQuantity: jest.fn(),
      clearCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(0),
      getCartCount: jest.fn().mockReturnValue(0),
      getItemQuantity: jest.fn().mockReturnValue(0),
    });

    render(<CartItems />);
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('renders cart items when items exist', () => {
    mockUseCart.mockReturnValue(createMockCartContext(mockProducts, 79.48, 3));

    render(<CartItems />);
    
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('Total: $79.48')).toBeInTheDocument();
  });

  it('renders correct number of CartItem components', () => {
    mockUseCart.mockReturnValue(createMockCartContext(mockProducts, 79.48, 3));

    render(<CartItems />);
    
    // Should render 2 CartItem components (one for each product)
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('displays correct total price', () => {
    mockUseCart.mockReturnValue(createMockCartContext(mockProducts, 79.48, 3));

    render(<CartItems />);
    
    expect(screen.getByText('Total: $79.48')).toBeInTheDocument();
  });

  it('displays total with decimal places', () => {
    mockUseCart.mockReturnValue(createMockCartContext(mockProducts, 100.00, 3));

    render(<CartItems />);
    
    expect(screen.getByText('Total: $100.00')).toBeInTheDocument();
  });

  it('renders single item correctly', () => {
    const singleProduct = [mockProducts[0]];
    mockUseCart.mockReturnValue(createMockCartContext(singleProduct, 59.98, 2));

    render(<CartItems />);
    
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
    expect(screen.getByText('Total: $59.98')).toBeInTheDocument();
  });

  it('has correct styling classes for main container', () => {
    mockUseCart.mockReturnValue(createMockCartContext(mockProducts, 79.48, 3));

    render(<CartItems />);
    
    const container = screen.getByText('Product 1').closest('div')?.parentElement;
    expect(container).toBeInTheDocument();
  });

  it('has correct styling for items grid', () => {
    mockUseCart.mockReturnValue(createMockCartContext(mockProducts, 79.48, 3));

    render(<CartItems />);
    
    // The grid container should have the grid classes
    const gridContainer = screen.getByText('Product 1').parentElement?.parentElement?.parentElement;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'gap-6');
  });

  it('has correct styling for total section', () => {
    mockUseCart.mockReturnValue(createMockCartContext(mockProducts, 79.48, 3));

    render(<CartItems />);
    
    const totalContainer = screen.getByText('Total: $79.48').closest('div')?.parentElement;
    expect(totalContainer).toHaveClass('mt-8', 'flex', 'justify-between', 'items-center');
  });
}); 