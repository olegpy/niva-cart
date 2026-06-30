import { render, screen } from '@testing-library/react';
import { FormField } from './form-field';
import { Input } from './input';

describe('FormField', () => {
  it('renders label linked to the control', () => {
    render(
      <FormField label="Email">
        <Input name="email" type="email" />
      </FormField>,
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('uses explicit id when provided', () => {
    render(
      <FormField label="Email" id="email">
        <Input name="email" type="email" />
      </FormField>,
    );

    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'email');
  });

  it('passes invalid and aria-describedby to the control', () => {
    render(
      <FormField label="Email" invalid describedBy="email-error">
        <Input name="email" type="email" />
      </FormField>,
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
  });

  it('does not override control props when field props are omitted', () => {
    render(
      <FormField label="Email">
        <Input name="email" aria-describedby="custom-error" invalid />
      </FormField>,
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-describedby', 'custom-error');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
