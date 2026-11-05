import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Chip } from './Chip';

describe('Chip', () => {
  it('is a plain label without onClick', () => {
    render(<Chip>5 min</Chip>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('5 min')).toHaveClass('chip');
  });

  it('is a toggle button with onClick, and reports its state', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Chip onClick={onClick}>5 min</Chip>);

    const chip = screen.getByRole('button', { name: '5 min' });
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(chip);
    expect(onClick).toHaveBeenCalledOnce();

    rerender(
      <Chip onClick={onClick} selected>
        5 min
      </Chip>,
    );
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(chip).toHaveClass('selected');
    // The tick means "selected" is visible without relying on colour.
    expect(chip.querySelector('svg')).toBeInTheDocument();
  });
});
