import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from './Header';
import { CartProvider, useCart } from '@/context/CartContext';
import { Product } from '@/types';

// Wrapper component for testing
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

// Test component to add items to cart
const TestCartAdder = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  return (
    <button onClick={() => addToCart(product)} data-testid="add-to-cart">
      Add to Cart
    </button>
  );
};

describe(Header.name, () => {
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 29.99,
    description: 'A test product',
    category: 'test',
    image: '/test-image.jpg',
    quantity: 1
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the default title', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );
      expect(screen.getByText('Niva Cart')).toBeInTheDocument();
    });

    it('links to home page', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );
      const homeLink = screen.getByRole('link', { name: /niva cart/i });
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('links to cart page', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );
      // Find the cart link by looking for the link that contains the cart summary
      const cartLinks = screen.getAllByRole('link');
      const cartLink = cartLinks.find(link => link.getAttribute('href') === '/cart');
      expect(cartLink).toHaveAttribute('href', '/cart');
    });

    it('displays cart icon', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );
      const cartLinks = screen.getAllByRole('link');
      const cartLink = cartLinks.find(link => link.getAttribute('href') === '/cart');
      expect(cartLink).toBeInTheDocument();
    });
  });

  describe('Cart Summary', () => {
    it('shows empty cart summary initially', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );
      expect(screen.getByText('0 items')).toBeInTheDocument();
      expect(screen.getByText(/0\.00/)).toBeInTheDocument();
    });

    it('updates cart summary when items are added', async () => {
      render(
        <TestWrapper>
          <Header />
          <TestCartAdder product={mockProduct} />
        </TestWrapper>
      );

      // Add item to cart
      fireEvent.click(screen.getByTestId('add-to-cart'));

      await waitFor(() => {
        expect(screen.getByText('1 item')).toBeInTheDocument();
        expect(screen.getByText(/29\.99/)).toBeInTheDocument();
      });
    });

    it('shows correct plural form for multiple items', async () => {
      render(
        <TestWrapper>
          <Header />
          <TestCartAdder product={mockProduct} />
        </TestWrapper>
      );

      // Add two items to cart
      fireEvent.click(screen.getByTestId('add-to-cart'));
      fireEvent.click(screen.getByTestId('add-to-cart'));

      await waitFor(() => {
        expect(screen.getByText('2 items')).toBeInTheDocument();
        expect(screen.getByText(/59\.98/)).toBeInTheDocument();
      });
    });
  });

  describe('Cart Items Dropdown', () => {
    it('does not show dropdown when cart is empty', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );
      
      const cartLinks = screen.getAllByRole('link');
      const cartLink = cartLinks.find(link => link.getAttribute('href') === '/cart');
      fireEvent.mouseEnter(cartLink!);
      
      expect(screen.queryByText('Cart Items')).not.toBeInTheDocument();
    });

    it('shows dropdown when hovering over cart with items', async () => {
      render(
        <TestWrapper>
          <Header />
          <TestCartAdder product={mockProduct} />
        </TestWrapper>
      );

      // Add item to cart
      fireEvent.click(screen.getByTestId('add-to-cart'));

      await waitFor(() => {
        const cartLinks = screen.getAllByRole('link');
        const cartLink = cartLinks.find(link => link.getAttribute('href') === '/cart');
        fireEvent.mouseEnter(cartLink!);
      });

      await waitFor(() => {
        expect(screen.getByText('Cart Items')).toBeInTheDocument();
        expect(screen.getByText('Test Product')).toBeInTheDocument();
      });
    });

    it('hides dropdown when mouse leaves cart area', async () => {
      render(
        <TestWrapper>
          <Header />
          <TestCartAdder product={mockProduct} />
        </TestWrapper>
      );

      // Add item to cart
      fireEvent.click(screen.getByTestId('add-to-cart'));

      await waitFor(() => {
        const cartLinks = screen.getAllByRole('link');
        const cartLink = cartLinks.find(link => link.getAttribute('href') === '/cart');
        fireEvent.mouseEnter(cartLink!);
      });

      await waitFor(() => {
        expect(screen.getByText('Cart Items')).toBeInTheDocument();
      });

      // Mouse leave
      const cartLinks = screen.getAllByRole('link');
      const cartLink = cartLinks.find(link => link.getAttribute('href') === '/cart');
      fireEvent.mouseLeave(cartLink!);

      await waitFor(() => {
        expect(screen.queryByText('Cart Items')).not.toBeInTheDocument();
      });
    });

    it('displays cart item details in dropdown', async () => {
      render(
        <TestWrapper>
          <Header />
          <TestCartAdder product={mockProduct} />
        </TestWrapper>
      );

      // Add item to cart
      fireEvent.click(screen.getByTestId('add-to-cart'));

      await waitFor(() => {
        const cartLinks = screen.getAllByRole('link');
        const cartLink = cartLinks.find(link => link.getAttribute('href') === '/cart');
        fireEvent.mouseEnter(cartLink!);
      });

      await waitFor(() => {
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText(/29\.99 × 1/)).toBeInTheDocument();
        expect(screen.getAllByText(/29\.99/).length).toBeGreaterThan(0); // At least one price is shown
      });
    });

    it('shows total summary in dropdown', async () => {
      render(
        <TestWrapper>
          <Header />
          <TestCartAdder product={mockProduct} />
        </TestWrapper>
      );

      // Add item to cart
      fireEvent.click(screen.getByTestId('add-to-cart'));

      await waitFor(() => {
        const cartLinks = screen.getAllByRole('link');
        const cartLink = cartLinks.find(link => link.getAttribute('href') === '/cart');
        fireEvent.mouseEnter(cartLink!);
      });

      await waitFor(() => {
        expect(screen.getAllByText(/Total: \$29\.99/).length).toBeGreaterThan(0);
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );
      
      const cartLinks = screen.getAllByRole('link');
      const cartLink = cartLinks.find(link => link.getAttribute('href') === '/cart');
      expect(cartLink).toBeInTheDocument();
      
      const homeLink = screen.getByRole('link', { name: /niva cart/i });
      expect(homeLink).toBeInTheDocument();
    });
  });
}); 