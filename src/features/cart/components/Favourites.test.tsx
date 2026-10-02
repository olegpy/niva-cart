import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Favourites } from './Favourites';

const items = [
  { productId: 1, title: 'Desk Lamp', price: 24.5, image: '/lamp.jpg' },
  { productId: 2, title: 'Notebook', price: 3, image: '/notebook.jpg' },
];

describe('Favourites', () => {
  it('renders nothing when there are no favourites', () => {
    const { container } = render(
      <Favourites items={[]} onMoveToCart={jest.fn()} pendingId={null} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('shows a heading with the favourite count', () => {
    render(<Favourites items={items} onMoveToCart={jest.fn()} pendingId={null} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Favourites (2)' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Favourites (2)' })).toBeInTheDocument();
  });

  it('lists every favourite', () => {
    render(<Favourites items={items} onMoveToCart={jest.fn()} pendingId={null} />);

    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(within(list).getByText('Desk Lamp')).toBeInTheDocument();
    expect(within(list).getByText('Notebook')).toBeInTheDocument();
  });

  it('disables only the item whose move is pending', () => {
    render(<Favourites items={items} onMoveToCart={jest.fn()} pendingId={2} />);

    expect(screen.getByRole('button', { name: 'Move to Cart: Notebook' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move to Cart: Desk Lamp' })).toBeEnabled();
  });

  it('forwards the clicked product id to onMoveToCart', async () => {
    const onMoveToCart = jest.fn();
    render(<Favourites items={items} onMoveToCart={onMoveToCart} pendingId={null} />);

    await userEvent.click(screen.getByRole('button', { name: 'Move to Cart: Desk Lamp' }));

    expect(onMoveToCart).toHaveBeenCalledWith(1);
  });
});
