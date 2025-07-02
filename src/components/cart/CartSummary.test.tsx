import { render, screen, fireEvent } from '@testing-library/react';
import CartSummary from './CartSummary';

// Mock the useCart hook
jest.mock('@/context/CartContext', () => ({
  ...jest.requireActual('@/context/CartContext'),
  useCart: jest.fn(),
}));

import { useCart } from '@/context/CartContext';

const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;

// Helper function to create a complete mock cart context
const createMockCartContext = (overrides: Partial<ReturnType<typeof useCart>> = {}) => ({
  items: [],
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
  incrementQuantity: jest.fn(),
  decrementQuantity: jest.fn(),
  clearCart: jest.fn(),
  getCartTotal: jest.fn().mockReturnValue(29.99),
  getCartCount: jest.fn().mockReturnValue(2),
  getItemQuantity: jest.fn(),
  ...overrides,
});

describe('CartSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cart total and item count by default', () => {
    mockUseCart.mockReturnValue(createMockCartContext());

    render(<CartSummary />);
    
    expect(screen.getByText(/29\.99/)).toBeInTheDocument();
    expect(screen.getByText('2 items')).toBeInTheDocument();
  });

  it('renders singular "item" when count is 1', () => {
    mockUseCart.mockReturnValue(createMockCartContext({
      getCartTotal: jest.fn().mockReturnValue(19.50),
      getCartCount: jest.fn().mockReturnValue(1),
    }));

    render(<CartSummary />);
    
    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  it('renders plural "items" when count is 0', () => {
    mockUseCart.mockReturnValue(createMockCartContext({
      getCartTotal: jest.fn().mockReturnValue(0),
      getCartCount: jest.fn().mockReturnValue(0),
    }));

    render(<CartSummary />);
    
    expect(screen.getByText('0 items')).toBeInTheDocument();
  });

  it('hides item count when showItemCount is false', () => {
    mockUseCart.mockReturnValue(createMockCartContext());

    render(<CartSummary showItemCount={false} />);
    
    expect(screen.getByText(/29\.99/)).toBeInTheDocument();
    expect(screen.queryByText('2 items')).not.toBeInTheDocument();
  });

  it('displays total with two decimal places', () => {
    mockUseCart.mockReturnValue(createMockCartContext({
      getCartTotal: jest.fn().mockReturnValue(100),
      getCartCount: jest.fn().mockReturnValue(1),
    }));

    render(<CartSummary />);
    
    expect(screen.getByText(/100\.00/)).toBeInTheDocument();
  });

  it('displays total with decimal values correctly', () => {
    mockUseCart.mockReturnValue(createMockCartContext({
      getCartTotal: jest.fn().mockReturnValue(19.5),
      getCartCount: jest.fn().mockReturnValue(1),
    }));

    render(<CartSummary />);
    
    expect(screen.getByText(/19\.50/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    mockUseCart.mockReturnValue(createMockCartContext());

    render(<CartSummary className="custom-class" />);
    
    const container = screen.getByTestId('cart-summary-container');
    expect(container).toHaveClass('custom-class');
  });

  it('has correct default styling classes', () => {
    mockUseCart.mockReturnValue(createMockCartContext());

    render(<CartSummary />);
    
    const container = screen.getByTestId('cart-summary-container');
    expect(container).toHaveClass('flex', 'items-center', 'gap-4');
  });

  it('renders item count with correct styling', () => {
    mockUseCart.mockReturnValue(createMockCartContext());

    render(<CartSummary />);
    
    const itemCount = screen.getByText('2 items');
    expect(itemCount).toHaveClass('text-sm', 'text-gray-600');
  });

  it('renders total with correct styling', () => {
    mockUseCart.mockReturnValue(createMockCartContext());

    render(<CartSummary />);
    
    const total = screen.getByText(/29\.99/);
    expect(total).toHaveClass('font-semibold', 'text-lg');
  });

  it('handles large numbers correctly', () => {
    mockUseCart.mockReturnValue(createMockCartContext({
      getCartTotal: jest.fn().mockReturnValue(1234.56),
      getCartCount: jest.fn().mockReturnValue(10),
    }));

    render(<CartSummary />);
    
    expect(screen.getByText(/1234\.56/)).toBeInTheDocument();
    expect(screen.getByText('10 items')).toBeInTheDocument();
  });

  it('handles zero total correctly', () => {
    mockUseCart.mockReturnValue(createMockCartContext({
      getCartTotal: jest.fn().mockReturnValue(0),
      getCartCount: jest.fn().mockReturnValue(0),
    }));

    render(<CartSummary />);
    
    expect(screen.getByText(/0\.00/)).toBeInTheDocument();
    expect(screen.getByText('0 items')).toBeInTheDocument();
  });

  describe('Clear Cart Button', () => {
    it('does not render clear button by default', () => {
      mockUseCart.mockReturnValue(createMockCartContext());

      render(<CartSummary />);
      
      expect(screen.queryByRole('button', { name: /clear cart/i })).not.toBeInTheDocument();
    });

    it('renders clear button when showClearButton is true and cart has items', () => {
      mockUseCart.mockReturnValue(createMockCartContext({
        getCartCount: jest.fn().mockReturnValue(2),
      }));

      render(<CartSummary showClearButton={true} />);
      
      const clearButton = screen.getByRole('button', { name: /clear cart/i });
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toHaveTextContent('Clear Cart');
    });

    it('does not render clear button when cart is empty even if showClearButton is true', () => {
      mockUseCart.mockReturnValue(createMockCartContext({
        getCartCount: jest.fn().mockReturnValue(0),
      }));

      render(<CartSummary showClearButton={true} />);
      
      expect(screen.queryByRole('button', { name: /clear cart/i })).not.toBeInTheDocument();
    });

    it('calls clearCart when clear button is clicked', () => {
      const mockClearCart = jest.fn();
      mockUseCart.mockReturnValue(createMockCartContext({
        getCartCount: jest.fn().mockReturnValue(2),
        clearCart: mockClearCart,
      }));

      render(<CartSummary showClearButton={true} />);
      
      const clearButton = screen.getByRole('button', { name: /clear cart/i });
      fireEvent.click(clearButton);
      
      expect(mockClearCart).toHaveBeenCalledTimes(1);
    });

    it('has correct styling for clear button', () => {
      mockUseCart.mockReturnValue(createMockCartContext({
        getCartCount: jest.fn().mockReturnValue(2),
      }));

      render(<CartSummary showClearButton={true} />);
      
      const clearButton = screen.getByRole('button', { name: /clear cart/i });
      expect(clearButton).toHaveClass(
        'px-3',
        'py-1',
        'text-sm',
        'bg-red-500',
        'text-white',
        'rounded',
        'hover:bg-red-600',
        'transition-colors'
      );
    });

    it('has proper accessibility attributes', () => {
      mockUseCart.mockReturnValue(createMockCartContext({
        getCartCount: jest.fn().mockReturnValue(2),
      }));

      render(<CartSummary showClearButton={true} />);
      
      const clearButton = screen.getByRole('button', { name: /clear cart/i });
      expect(clearButton).toHaveAttribute('aria-label', 'Clear cart');
    });
  });
}); 