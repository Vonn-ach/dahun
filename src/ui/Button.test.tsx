import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../test/render';
import { Button, ButtonLink } from './Button';

describe('Button', () => {
  it('is a primary, non-submitting button by default', async () => {
    const onClick = vi.fn();
    renderWithProviders(<Button onClick={onClick}>Go</Button>);

    const button = screen.getByRole('button', { name: 'Go' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('button', 'primary');

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('supports the ghost variant', () => {
    renderWithProviders(<Button variant="ghost">Later</Button>);
    expect(screen.getByRole('button', { name: 'Later' })).toHaveClass('ghost');
  });

  it('can be reached and pressed with the keyboard', async () => {
    const onClick = vi.fn();
    renderWithProviders(<Button onClick={onClick}>Go</Button>);

    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Go' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('ButtonLink', () => {
  it('is a link styled as a button', () => {
    renderWithProviders(<ButtonLink to="/practice">Practise now</ButtonLink>);
    const link = screen.getByRole('link', { name: 'Practise now' });
    expect(link).toHaveAttribute('href', '/practice');
    expect(link).toHaveClass('button', 'primary');
  });
});
