import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../test/render';
import { ProgressBeads } from './ProgressBeads';

describe('ProgressBeads', () => {
  it('draws one bead per item with a class for its level', () => {
    renderWithProviders(
      <ProgressBeads levels={['new', 'learning', 'known', 'longterm', 'known']} />,
    );

    const beads = screen.getByRole('img').querySelectorAll('[data-level]');
    expect(beads).toHaveLength(5);
    expect([...beads].map((bead) => bead.getAttribute('data-level'))).toEqual([
      'new',
      'learning',
      'known',
      'longterm',
      'known',
    ]);
    expect(beads[0]).toHaveClass('bead', 'new');
    expect(beads[3]).toHaveClass('bead', 'longterm');
  });

  it('gives screen readers a count per level instead of the beads', () => {
    renderWithProviders(<ProgressBeads levels={['new', 'known', 'known']} />);
    expect(screen.getByRole('img')).toHaveAccessibleName('1 new, 0 learning, 2 known, 0 long-term');
  });

  it('uses the UI language for the summary', () => {
    renderWithProviders(<ProgressBeads levels={['new']} />, { locale: 'ms' });
    expect(screen.getByRole('img')).toHaveAccessibleName(
      '1 baharu, 0 sedang belajar, 0 diketahui, 0 jangka panjang',
    );
  });

  it('accepts a custom label', () => {
    renderWithProviders(<ProgressBeads levels={['new']} label="Unit 1: 1 new" />);
    expect(screen.getByRole('img')).toHaveAccessibleName('Unit 1: 1 new');
  });
});
