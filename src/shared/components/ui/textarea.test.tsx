import { render, screen } from '@testing-library/react';
import { Textarea } from './textarea';
import { Label } from './label';

describe('Textarea', () => {
  it('renders a textarea with placeholder', () => {
    render(<Textarea placeholder="Your question" />);
    expect(screen.getByPlaceholderText('Your question')).toBeInTheDocument();
  });

  it('links to Label via id and htmlFor', () => {
    render(
      <>
        <Label htmlFor="question">Question</Label>
        <Textarea id="question" name="question" />
      </>,
    );

    expect(screen.getByLabelText('Question')).toBeInTheDocument();
  });

  it('sets aria-invalid when invalid', () => {
    render(<Textarea invalid aria-label="Question" />);

    const textarea = screen.getByRole('textbox', { name: 'Question' });
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveClass('border-red-500');
  });

  it('supports aria-describedby', () => {
    render(<Textarea aria-label="Question" aria-describedby="question-error" />);
    expect(screen.getByRole('textbox', { name: 'Question' })).toHaveAttribute(
      'aria-describedby',
      'question-error',
    );
  });
});
