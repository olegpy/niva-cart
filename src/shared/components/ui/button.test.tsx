import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('renders children and handles click', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('defaults to type="button"', () => {
    render(<Button>Action</Button>);
    expect(screen.getByRole('button', { name: 'Action' })).toHaveAttribute('type', 'button');
  });

  it('supports submit type', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit');
  });

  it('disables the button when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });

  it('disables and sets aria-busy when loading', () => {
    render(<Button loading>Saving…</Button>);

    const button = screen.getByRole('button', { name: 'Saving…' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('applies variant styles', () => {
    const { rerender } = render(<Button>Primary</Button>);
    expect(screen.getByRole('button', { name: 'Primary' })).toHaveClass('bg-red-600');

    rerender(<Button variant="secondary">Store</Button>);
    expect(screen.getByRole('button', { name: 'Store' })).toHaveClass('bg-blue-600');
  });

  it('applies size styles', () => {
    render(<Button variant="destructive" size="sm">Clear</Button>);
    expect(screen.getByRole('button', { name: 'Clear' })).toHaveClass('px-3', 'py-1', 'bg-red-500');
  });

  it('renders primary button by default', () => {
    render(<Button>Sign in</Button>);
    expect(screen.getByRole('button', { name: 'Sign in' })).toHaveClass('bg-red-600');
  });

  it('supports formButtonClassName for full-width submits', () => {
    render(<Button className="w-full">Sign in</Button>);
    expect(screen.getByRole('button', { name: 'Sign in' })).toHaveClass('w-full', 'bg-red-600');
  });

  it('merges custom className', () => {
    render(<Button className="w-full">Full width</Button>);
    expect(screen.getByRole('button', { name: 'Full width' })).toHaveClass('w-full', 'bg-red-600');
  });

  it('forwards ref to the native button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('exposes accessible name for icon buttons via aria-label', () => {
    render(
      <Button size="icon" aria-label="Send message">
        →
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
  });
});
