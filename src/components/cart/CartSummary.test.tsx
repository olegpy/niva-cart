import { render, screen } from '@testing-library/react';
import CartSummary from './CartSummary';

// Mock the useCart hook
jest.mock('@/context/CartContext', () => ({
  ...jest.requireActual('@/context/CartContext'),
  useCart: jest.fn(),
}));

import { useCart } from '@/context/CartContext';

const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;

describe('CartSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cart total and item count by default', () => {
    mockUseCart.mockReturnValue({
      items: [],
      addToCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(29.99),
      getCartCount: jest.fn().mockReturnValue(2),
    });

    render(<CartSummary />);
    
    expect(screen.getByText(/29\.99/)).toBeInTheDocument();
    expect(screen.getByText('2 items')).toBeInTheDocument();
  });

  it('renders singular "item" when count is 1', () => {
    mockUseCart.mockReturnValue({
      items: [],
      addToCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(19.50),
      getCartCount: jest.fn().mockReturnValue(1),
    });

    render(<CartSummary />);
    
    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  it('renders plural "items" when count is 0', () => {
    mockUseCart.mockReturnValue({
      items: [],
      addToCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(0),
      getCartCount: jest.fn().mockReturnValue(0),
    });

    render(<CartSummary />);
    
    expect(screen.getByText('0 items')).toBeInTheDocument();
  });

  it('hides item count when showItemCount is false', () => {
    mockUseCart.mockReturnValue({
      items: [],
      addToCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(29.99),
      getCartCount: jest.fn().mockReturnValue(2),
    });

    render(<CartSummary showItemCount={false} />);
    
    expect(screen.getByText(/29\.99/)).toBeInTheDocument();
    expect(screen.queryByText('2 items')).not.toBeInTheDocument();
  });

  it('displays total with two decimal places', () => {
    mockUseCart.mockReturnValue({
      items: [],
      addToCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(100),
      getCartCount: jest.fn().mockReturnValue(1),
    });

    render(<CartSummary />);
    
    expect(screen.getByText(/100\.00/)).toBeInTheDocument();
  });

  it('displays total with decimal values correctly', () => {
    mockUseCart.mockReturnValue({
      items: [],
      addToCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(19.5),
      getCartCount: jest.fn().mockReturnValue(1),
    });

    render(<CartSummary />);
    
    expect(screen.getByText(/19\.50/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    mockUseCart.mockReturnValue({
      items: [],
      addToCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(29.99),
      getCartCount: jest.fn().mockReturnValue(2),
    });

    render(<CartSummary className="custom-class" />);
    
    const container = screen.getByTestId('cart-summary-container');
    expect(container).toHaveClass('custom-class');
  });

  it('has correct default styling classes', () => {
    mockUseCart.mockReturnValue({
      items: [],
      addToCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(29.99),
      getCartCount: jest.fn().mockReturnValue(2),
    });

    render(<CartSummary />);
    
    const container = screen.getByTestId('cart-summary-container');
    expect(container).toHaveClass('flex', 'items-center', 'gap-4');
  });

  it('renders item count with correct styling', () => {
    mockUseCart.mockReturnValue({
      items: [],
      addToCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(29.99),
      getCartCount: jest.fn().mockReturnValue(2),
    });

    render(<CartSummary />);
    
    const itemCount = screen.getByText('2 items');
    expect(itemCount).toHaveClass('text-sm', 'text-gray-600');
  });

  it('renders total with correct styling', () => {
    mockUseCart.mockReturnValue({
      items: [],
      addToCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(29.99),
      getCartCount: jest.fn().mockReturnValue(2),
    });

    render(<CartSummary />);
    
    const total = screen.getByText(/29\.99/);
    expect(total).toHaveClass('font-semibold', 'text-lg');
  });

  it('handles large numbers correctly', () => {
    mockUseCart.mockReturnValue({
      items: [],
      addToCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(1234.56),
      getCartCount: jest.fn().mockReturnValue(10),
    });

    render(<CartSummary />);
    
    expect(screen.getByText(/1234\.56/)).toBeInTheDocument();
    expect(screen.getByText('10 items')).toBeInTheDocument();
  });

  it('handles zero total correctly', () => {
    mockUseCart.mockReturnValue({
      items: [],
      addToCart: jest.fn(),
      getCartTotal: jest.fn().mockReturnValue(0),
      getCartCount: jest.fn().mockReturnValue(0),
    });

    render(<CartSummary />);
    
    expect(screen.getByText(/0\.00/)).toBeInTheDocument();
    expect(screen.getByText('0 items')).toBeInTheDocument();
  });
}); 