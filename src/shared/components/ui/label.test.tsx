import { render, screen } from '@testing-library/react';
import { Label } from './label';
import { Input } from './input';

describe('Label', () => {
  it('renders label text', () => {
    render(<Label htmlFor="name">Full name</Label>);
    expect(screen.getByText('Full name')).toBeInTheDocument();
  });

  it('associates with an input through htmlFor', () => {
    render(
      <>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" />
      </>,
    );

    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(
      <Label htmlFor="name" className="mb-2">
        Name
      </Label>,
    );

    expect(screen.getByText('Name')).toHaveClass('mb-2', 'text-sm', 'font-medium');
  });
});
