import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('uses the neutral tone by default', () => {
    render(<Badge>Baram</Badge>);
    expect(screen.getByText('Baram')).toHaveClass('badge', 'neutral');
  });

  it('applies the requested tone', () => {
    render(<Badge tone="warning">Draft</Badge>);
    expect(screen.getByText('Draft')).toHaveClass('badge', 'warning');
  });
});
