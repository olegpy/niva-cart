import { render, screen, fireEvent, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

// Test component to use the cart context
const TestComponent = () => {
  const { 
    items, 
    addToCart, 
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getCartTotal, 
    getCartCount,
    getItemQuantity
  } = useCart();
  
  return (
    <div>
      <div data-testid="cart-count">{getCartCount()}</div>
      <div data-testid="cart-total">${getCartTotal().toFixed(2)}</div>
      <div data-testid="items-count">{items.length}</div>
      {items.map((item) => (
        <div key={item.product.id} data-testid={`item-${item.product.id}`}>
          {item.product.title} - Qty: {item.quantity}
        </div>
      ))}
      <button 
        data-testid="add-product-1"
        onClick={() => addToCart({
          id: 1,
          title: 'Product 1',
          price: 29.99,
          description: 'Test product 1',
          category: 'electronics',
          image: '/product1.jpg',
          quantity: 1
        })}
      >
        Add Product 1
      </button>
      <button 
        data-testid="add-product-2"
        onClick={() => addToCart({
          id: 2,
          title: 'Product 2',
          price: 19.50,
          description: 'Test product 2',
          category: 'clothing',
          image: '/product2.jpg',
          quantity: 1
        })}
      >
        Add Product 2
      </button>
      <button 
        data-testid="remove-product-1"
        onClick={() => removeFromCart(1)}
      >
        Remove Product 1
      </button>
      <button 
        data-testid="increment-product-1"
        onClick={() => incrementQuantity(1)}
      >
        Increment Product 1
      </button>
      <button 
        data-testid="decrement-product-1"
        onClick={() => decrementQuantity(1)}
      >
        Decrement Product 1
      </button>
      <button 
        data-testid="clear-cart"
        onClick={() => clearCart()}
      >
        Clear Cart
      </button>
      <div data-testid="product-1-quantity">{getItemQuantity(1)}</div>
      <div data-testid="product-2-quantity">{getItemQuantity(2)}</div>
      <div data-testid="product-3-quantity">{getItemQuantity(3)}</div>
    </div>
  );
};

// Wrapper component for testing
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CartProvider', () => {
    it('renders children without crashing', () => {
      render(
        <TestWrapper>
          <div>Test Content</div>
        </TestWrapper>
      );
      
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('provides initial empty cart state', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$0.00');
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    });
  });

  describe('useCart hook', () => {
    it('throws error when used outside CartProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useCart must be used within a CartProvider');
      
      consoleSpy.mockRestore();
    });

    it('provides cart context when used within CartProvider', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('cart-count')).toBeInTheDocument();
      expect(screen.getByTestId('cart-total')).toBeInTheDocument();
      expect(screen.getByTestId('items-count')).toBeInTheDocument();
    });
  });

  describe('addToCart function', () => {
    it('adds new product to cart', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      const addButton = screen.getByTestId('add-product-1');
      
      act(() => {
        fireEvent.click(addButton);
      });
      
      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$29.99');
      expect(screen.getByTestId('item-1')).toHaveTextContent('Product 1 - Qty: 1');
    });

    it('increments quantity when adding existing product', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      const addButton = screen.getByTestId('add-product-1');
      
      // Add product twice
      act(() => {
        fireEvent.click(addButton);
        fireEvent.click(addButton);
      });
      
      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$59.98');
      expect(screen.getByTestId('item-1')).toHaveTextContent('Product 1 - Qty: 2');
    });

    it('adds multiple different products', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      const addProduct1Button = screen.getByTestId('add-product-1');
      const addProduct2Button = screen.getByTestId('add-product-2');
      
      act(() => {
        fireEvent.click(addProduct1Button);
        fireEvent.click(addProduct2Button);
      });
      
      expect(screen.getByTestId('items-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$49.49');
      expect(screen.getByTestId('item-1')).toHaveTextContent('Product 1 - Qty: 1');
      expect(screen.getByTestId('item-2')).toHaveTextContent('Product 2 - Qty: 1');
    });
  });

  describe('getCartTotal function', () => {
    it('returns 0 for empty cart', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$0.00');
    });

    it('calculates total correctly for single item', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      const addButton = screen.getByTestId('add-product-1');
      
      act(() => {
        fireEvent.click(addButton);
      });
      
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$29.99');
    });

    it('calculates total correctly for multiple items with quantities', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      const addProduct1Button = screen.getByTestId('add-product-1');
      const addProduct2Button = screen.getByTestId('add-product-2');
      
      act(() => {
        fireEvent.click(addProduct1Button); // 29.99
        fireEvent.click(addProduct1Button); // 29.99 * 2 = 59.98
        fireEvent.click(addProduct2Button); // 19.50
      });
      
      // Total: 59.98 + 19.50 = 79.48
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$79.48');
    });
  });

  describe('getCartCount function', () => {
    it('returns 0 for empty cart', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    });

    it('returns correct count for single item', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      const addButton = screen.getByTestId('add-product-1');
      
      act(() => {
        fireEvent.click(addButton);
      });
      
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    });

    it('returns correct count for multiple items with quantities', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      const addProduct1Button = screen.getByTestId('add-product-1');
      const addProduct2Button = screen.getByTestId('add-product-2');
      
      act(() => {
        fireEvent.click(addProduct1Button); // quantity: 1
        fireEvent.click(addProduct1Button); // quantity: 2
        fireEvent.click(addProduct2Button); // quantity: 1
      });
      
      // Total count: 2 + 1 = 3
      expect(screen.getByTestId('cart-count')).toHaveTextContent('3');
    });
  });

  describe('removeFromCart function', () => {
    it('removes product from cart', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // First add products to cart
      const addProduct1Button = screen.getByTestId('add-product-1');
      const addProduct2Button = screen.getByTestId('add-product-2');
      
      act(() => {
        fireEvent.click(addProduct1Button);
        fireEvent.click(addProduct2Button);
      });
      
      // Verify products are in cart
      expect(screen.getByTestId('items-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
      expect(screen.getByTestId('item-1')).toBeInTheDocument();
      expect(screen.getByTestId('item-2')).toBeInTheDocument();
      
      // Remove product 1
      const removeButton = screen.getByTestId('remove-product-1');
      
      act(() => {
        fireEvent.click(removeButton);
      });
      
      // Verify product 1 is removed
      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$19.50');
      expect(screen.queryByTestId('item-1')).toBeNull();
      expect(screen.getByTestId('item-2')).toBeInTheDocument();
    });

    it('does nothing when removing non-existent product', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // Add one product
      const addProduct1Button = screen.getByTestId('add-product-1');
      
      act(() => {
        fireEvent.click(addProduct1Button);
      });
      
      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      
      // Try to remove non-existent product (id: 999)
      const removeButton = screen.getByTestId('remove-product-1');
      
      act(() => {
        fireEvent.click(removeButton);
      });
      
      // Cart should remain unchanged
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    });
  });

  describe('incrementQuantity function', () => {
    it('increments quantity of a product', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // First add product to cart
      const addProduct1Button = screen.getByTestId('add-product-1');
      
      act(() => {
        fireEvent.click(addProduct1Button);
      });
      
      // Verify initial state
      expect(screen.getByTestId('item-1')).toHaveTextContent('Product 1 - Qty: 1');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$29.99');
      
      // Increment quantity
      const incrementButton = screen.getByTestId('increment-product-1');
      
      act(() => {
        fireEvent.click(incrementButton);
      });
      
      // Verify quantity increased
      expect(screen.getByTestId('item-1')).toHaveTextContent('Product 1 - Qty: 2');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$59.98');
    });

    it('increments quantity multiple times', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // First add product to cart
      const addProduct1Button = screen.getByTestId('add-product-1');
      
      act(() => {
        fireEvent.click(addProduct1Button);
      });
      
      // Increment quantity twice
      const incrementButton = screen.getByTestId('increment-product-1');
      
      act(() => {
        fireEvent.click(incrementButton);
        fireEvent.click(incrementButton);
      });
      
      // Verify quantity increased to 3
      expect(screen.getByTestId('item-1')).toHaveTextContent('Product 1 - Qty: 3');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('3');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$89.97');
    });

    it('does nothing when incrementing non-existent product', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // Try to increment non-existent product
      const incrementButton = screen.getByTestId('increment-product-1');
      
      act(() => {
        fireEvent.click(incrementButton);
      });
      
      // Cart should remain empty
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$0.00');
    });
  });

  describe('decrementQuantity function', () => {
    it('decrements quantity of a product', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // First add product to cart twice (quantity: 2)
      const addProduct1Button = screen.getByTestId('add-product-1');
      
      act(() => {
        fireEvent.click(addProduct1Button);
        fireEvent.click(addProduct1Button);
      });
      
      // Verify initial state
      expect(screen.getByTestId('item-1')).toHaveTextContent('Product 1 - Qty: 2');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$59.98');
      
      // Decrement quantity
      const decrementButton = screen.getByTestId('decrement-product-1');
      
      act(() => {
        fireEvent.click(decrementButton);
      });
      
      // Verify quantity decreased
      expect(screen.getByTestId('item-1')).toHaveTextContent('Product 1 - Qty: 1');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$29.99');
    });

    it('removes product when decrementing to zero', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // First add product to cart
      const addProduct1Button = screen.getByTestId('add-product-1');
      
      act(() => {
        fireEvent.click(addProduct1Button);
      });
      
      // Verify initial state
      expect(screen.getByTestId('item-1')).toHaveTextContent('Product 1 - Qty: 1');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      
      // Decrement quantity to zero
      const decrementButton = screen.getByTestId('decrement-product-1');
      
      act(() => {
        fireEvent.click(decrementButton);
      });
      
      // Verify product is removed from cart
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$0.00');
      expect(screen.queryByTestId('item-1')).toBeNull();
    });

    it('does nothing when decrementing non-existent product', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // Try to decrement non-existent product
      const decrementButton = screen.getByTestId('decrement-product-1');
      
      act(() => {
        fireEvent.click(decrementButton);
      });
      
      // Cart should remain empty
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$0.00');
    });
  });

  describe('clearCart function', () => {
    it('clears all products from cart', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // First add multiple products to cart
      const addProduct1Button = screen.getByTestId('add-product-1');
      const addProduct2Button = screen.getByTestId('add-product-2');
      
      act(() => {
        fireEvent.click(addProduct1Button);
        fireEvent.click(addProduct2Button);
      });
      
      // Verify products are in cart
      expect(screen.getByTestId('items-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
      expect(screen.getByTestId('item-1')).toBeInTheDocument();
      expect(screen.getByTestId('item-2')).toBeInTheDocument();
      
      // Clear cart
      const clearButton = screen.getByTestId('clear-cart');
      
      act(() => {
        fireEvent.click(clearButton);
      });
      
      // Verify cart is empty
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$0.00');
      expect(screen.queryByTestId('item-1')).toBeNull();
      expect(screen.queryByTestId('item-2')).toBeNull();
    });

    it('does nothing when clearing empty cart', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // Verify cart is initially empty
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$0.00');
      
      // Clear cart
      const clearButton = screen.getByTestId('clear-cart');
      
      act(() => {
        fireEvent.click(clearButton);
      });
      
      // Cart should remain empty
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('$0.00');
    });
  });

  describe('getItemQuantity function', () => {
    it('returns correct quantity for existing products', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // Add products to cart
      const addProduct1Button = screen.getByTestId('add-product-1');
      const addProduct2Button = screen.getByTestId('add-product-2');
      
      act(() => {
        fireEvent.click(addProduct1Button); // Product 1: quantity 1
        fireEvent.click(addProduct1Button); // Product 1: quantity 2
        fireEvent.click(addProduct2Button); // Product 2: quantity 1
      });
      
      // Verify quantities
      expect(screen.getByTestId('product-1-quantity')).toHaveTextContent('2');
      expect(screen.getByTestId('product-2-quantity')).toHaveTextContent('1');
    });

    it('returns 0 for non-existent products', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // Product 3 doesn't exist in cart
      expect(screen.getByTestId('product-3-quantity')).toHaveTextContent('0');
    });

    it('returns 0 for products that were removed', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // Add product 1
      const addProduct1Button = screen.getByTestId('add-product-1');
      
      act(() => {
        fireEvent.click(addProduct1Button);
      });
      
      // Verify product 1 quantity is 1
      expect(screen.getByTestId('product-1-quantity')).toHaveTextContent('1');
      
      // Remove product 1
      const removeButton = screen.getByTestId('remove-product-1');
      
      act(() => {
        fireEvent.click(removeButton);
      });
      
      // Verify product 1 quantity is now 0
      expect(screen.getByTestId('product-1-quantity')).toHaveTextContent('0');
    });
  });
}); 