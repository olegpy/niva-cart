import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavouriteItem } from './FavouriteItem';

const item = { productId: 12, title: 'Desk Lamp', price: 24.5, image: '/lamp.jpg' };

describe('FavouriteItem', () => {
  it('shows the product image, title and formatted price', () => {
    render(<FavouriteItem item={item} onMoveToCart={jest.fn()} isPending={false} />);

    expect(screen.getByRole('heading', { name: 'Desk Lamp' })).toBeInTheDocument();
    expect(screen.getByText('$24.50')).toBeInTheDocument();
    const image = screen.getByRole('img', { name: 'Desk Lamp' });
    expect(image).toHaveAttribute('src', '/lamp.jpg');
    expect(image).toHaveAttribute('width', '64');
    expect(image).toHaveAttribute('height', '64');
  });

  it('labels the move button with the product title', () => {
    render(<FavouriteItem item={item} onMoveToCart={jest.fn()} isPending={false} />);

    expect(screen.getByRole('button', { name: 'Move to Cart: Desk Lamp' })).toHaveTextContent(
      'Move to Cart',
    );
  });

  it('requests a move to cart with the product id when clicked', async () => {
    const onMoveToCart = jest.fn();
    render(<FavouriteItem item={item} onMoveToCart={onMoveToCart} isPending={false} />);

    await userEvent.click(screen.getByRole('button', { name: 'Move to Cart: Desk Lamp' }));

    expect(onMoveToCart).toHaveBeenCalledWith(12);
  });

  it('disables the move button while a request is pending', async () => {
    const onMoveToCart = jest.fn();
    render(<FavouriteItem item={item} onMoveToCart={onMoveToCart} isPending />);

    const button = screen.getByRole('button', { name: 'Move to Cart: Desk Lamp' });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onMoveToCart).not.toHaveBeenCalled();
  });
});
