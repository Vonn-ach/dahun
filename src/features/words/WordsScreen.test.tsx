import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/render';
import { emptyBundle, staticSource, testBundle } from '../../test/content';
import { WordsScreen } from './WordsScreen';

const rowFor = (id: string) => {
  const row = document.querySelector<HTMLElement>(`[data-entry-id="${id}"]`);
  if (!row) throw new Error(`No row for ${id}`);
  return within(row);
};

describe('WordsScreen', () => {
  it('lists every entry in the bundle with its gloss', () => {
    renderWithProviders(<WordsScreen />);
    const list = screen.getByRole('list', { name: 'Word list' });
    expect(list.querySelectorAll('[data-entry-id]')).toHaveLength(testBundle.entries.length);
    expect(screen.getByRole('status')).toHaveTextContent('Showing 6 of 6 words');
    expect(rowFor('tst-0002').getByText('river')).toBeInTheDocument();
  });

  it('shows the form exactly as written, marked with the language code', () => {
    renderWithProviders(<WordsScreen />);
    const form = document.querySelector('[data-entry-id="tst-0002"] [lang="tst"]');
    expect(form).toHaveTextContent("bravo'");
    expect(form?.querySelector('[data-highlight]')).toHaveTextContent("'");
  });

  it('shows status, dialect, variant and source labels', () => {
    renderWithProviders(<WordsScreen />);
    expect(rowFor('tst-0004').getByText('Draft')).toBeInTheDocument();
    expect(rowFor('tst-0001').queryByText('Draft')).not.toBeInTheDocument();
    expect(rowFor('tst-0003').getByText('Checked by one speaker')).toBeInTheDocument();
    // Selectable dialects get a badge; "shared" doesn't.
    expect(rowFor('tst-0003').getByText('South Testish')).toBeInTheDocument();
    expect(rowFor('tst-0002').queryByText('Shared')).not.toBeInTheDocument();
    // A dialect variant gets a labelled line, other variants go under "Also:".
    expect(rowFor('tst-0003').getByText('North Testish:')).toBeInTheDocument();
    expect(rowFor('tst-0003').getByText('Also:')).toBeInTheDocument();
    expect(rowFor('tst-0002').getByText('Test field notes')).toBeInTheDocument();
  });

  it('searches forms, variants and glosses', async () => {
    const user = userEvent.setup();
    renderWithProviders(<WordsScreen />);
    const search = screen.getByRole('searchbox', { name: 'Search words' });

    await user.type(search, 'charly');
    expect(document.querySelectorAll('[data-entry-id]')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('Showing 1 of 6 words');

    await user.clear(search);
    await user.type(search, 'ikan');
    expect(rowFor('tst-0006').getByText('fish')).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, 'zzzz');
    expect(screen.getByText('No words match your search.')).toBeInTheDocument();
  });

  it('filters by unit with toggle chips', async () => {
    const user = userEvent.setup();
    renderWithProviders(<WordsScreen />);
    const chips = screen.getByRole('group', { name: 'Show words from' });
    const more = within(chips).getByRole('button', { name: 'More' });

    await user.click(more);
    expect(more).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Showing 3 of 6 words');

    await user.click(within(chips).getByRole('button', { name: 'All units' }));
    expect(screen.getByRole('status')).toHaveTextContent('Showing 6 of 6 words');
  });

  it('shows glosses, units and labels in Malay', () => {
    renderWithProviders(<WordsScreen />, { locale: 'ms' });
    expect(rowFor('tst-0002').getByText('sungai')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Asas' })).toBeInTheDocument();
    expect(rowFor('tst-0004').getByText('Draf')).toBeInTheDocument();
  });

  it('explains that words are being checked when the bundle is empty', () => {
    renderWithProviders(<WordsScreen />, { content: staticSource([emptyBundle], 'release') });
    expect(screen.getByRole('heading', { name: 'Being checked by speakers' })).toBeInTheDocument();
    expect(screen.getByText('0 of 6 words checked so far.')).toBeInTheDocument();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });
});
