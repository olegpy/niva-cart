import { render, screen } from '@testing-library/react';
import { Alert } from './alert';

describe('Alert', () => {
  it('renders message content', () => {
    render(<Alert>Invalid email or password</Alert>);
    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
  });

  it('uses alert role and assertive live region', () => {
    render(<Alert>Something went wrong</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Something went wrong');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it('supports id for aria-describedby from form fields', () => {
    render(<Alert id="form-error">Required field missing</Alert>);
    expect(screen.getByRole('alert')).toHaveAttribute('id', 'form-error');
  });

  it('applies destructive variant styles by default', () => {
    render(<Alert>Error</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-red-50', 'text-red-600');
  });
});
