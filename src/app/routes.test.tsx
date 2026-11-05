import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { describe, expect, it } from 'vitest';
import { I18nProvider } from '../i18n';
import { routes } from './routes';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <I18nProvider initialLocale="en">
      <RouterProvider router={router} />
    </I18nProvider>,
  );
  return router;
}

describe('routes', () => {
  it.each([
    ['/', 'Learning path'],
    ['/lesson/example', 'Lesson'],
    ['/practice', 'Practice'],
    ['/words', 'Words'],
    ['/progress', 'Progress'],
    ['/settings', 'Settings'],
    ['/credits', 'Credits'],
    ['/no-such-page', 'Page not found'],
  ])('%s shows the "%s" screen', (path, heading) => {
    renderAt(path);
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    expect(document.title).toBe(`${heading} · Dahun`);
  });

  it('marks the current section in the main navigation', () => {
    renderAt('/words');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Words' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(nav).getByRole('link', { name: 'Learn' })).not.toHaveAttribute('aria-current');
  });

  it('moves focus to the new heading after navigating', async () => {
    renderAt('/');
    await userEvent.click(screen.getByRole('link', { name: 'Practice' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Practice' })).toHaveFocus();
  });
});
