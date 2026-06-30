import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Input } from './input';
import { Label } from './label';

describe('Input', () => {
  it('renders an input with placeholder', () => {
    render(<Input placeholder="Enter email" />);
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('links to Label via id and htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" />
      </>,
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('assigns an id when none is provided', () => {
    render(<Input aria-label="Email" />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('id');
  });

  it('sets aria-invalid and invalid styles when invalid', () => {
    render(<Input invalid aria-label="Email" />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveClass('border-red-500');
  });

  it('supports aria-describedby for error messages', () => {
    render(<Input aria-label="Email" aria-describedby="email-error" />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
      'aria-describedby',
      'email-error',
    );
  });

  it('forwards ref to the native input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Email" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
