import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders its content in a div by default', () => {
    render(<Card data-testid="card">Unit 1</Card>);
    const card = screen.getByTestId('card');
    expect(card.tagName).toBe('DIV');
    expect(card).toHaveClass('card');
    expect(card).toHaveTextContent('Unit 1');
  });

  it('can render as a list item so lists of cards stay real lists', () => {
    render(
      <ul>
        <Card as="li">Unit 1</Card>
      </ul>,
    );
    expect(screen.getByRole('listitem')).toHaveTextContent('Unit 1');
  });
});
