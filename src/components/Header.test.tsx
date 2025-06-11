import { render, screen } from '@testing-library/react';
import Header from './Header';

describe(Header.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the default title', () => {
    render(<Header />);
    expect(screen.getByText('Niva Cart')).toBeInTheDocument();
  });

  it('links to home page', () => {
    render(<Header />);
    const homeLink = screen.getByRole('link', { name: /niva cart/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });
}); 