import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PathScreen } from '../features/path';
import { emptyBundle, staticSource, testBundle } from '../test/content';
import { renderWithProviders } from '../test/render';
import { PreviewBanner } from './PreviewBanner';

describe('PreviewBanner', () => {
  it('labels a draft build', () => {
    renderWithProviders(<PreviewBanner />, { content: staticSource([testBundle], 'draft') });
    expect(screen.getByRole('note')).toHaveTextContent('Preview');
    expect(screen.getByRole('note')).toHaveTextContent('Words marked Draft may be wrong.');
  });

  it('labels a beta build', () => {
    renderWithProviders(<PreviewBanner />, { content: staticSource([testBundle], 'beta') });
    expect(screen.getByRole('note')).toHaveTextContent('Beta');
  });

  it('is absent from a release build', () => {
    renderWithProviders(<PreviewBanner />, { content: staticSource([testBundle], 'release') });
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });
});

describe('PathScreen', () => {
  it('links to the first lesson in the bundle', () => {
    renderWithProviders(<PathScreen />);
    expect(screen.getByRole('link', { name: 'Open the first lesson' })).toHaveAttribute(
      'href',
      '/lesson/basics-1',
    );
  });

  it('says the course is being checked when no lesson is ready', () => {
    renderWithProviders(<PathScreen />, { content: staticSource([emptyBundle], 'release') });
    expect(screen.getByRole('heading', { name: 'Being checked by speakers' })).toBeInTheDocument();
    expect(
      screen.getByText(/Every Testish word is checked by two fluent speakers/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Open the first lesson' })).not.toBeInTheDocument();
  });

  it('says so when the build has no course at all', () => {
    renderWithProviders(<PathScreen />, { content: staticSource([]) });
    expect(screen.getByRole('heading', { name: 'No course yet' })).toBeInTheDocument();
  });
});
