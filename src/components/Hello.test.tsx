import { render, screen } from '@testing-library/react';
import Hello from './Hello';

test('renders greeting with name', () => {
    render(<Hello name="Alice" />);

    expect(screen.getByText('Hello, Alice!')).toBeInTheDocument();
});