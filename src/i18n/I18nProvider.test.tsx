import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from './I18nProvider';
import { useLocale, useT } from './useT';

function Probe() {
  const t = useT();
  const { setLocale } = useLocale();
  return (
    <button type="button" onClick={() => setLocale('ms')}>
      {t('nav.practice')}
    </button>
  );
}

describe('I18nProvider', () => {
  it('translates, switches language and keeps <html lang> in step', async () => {
    render(
      <I18nProvider initialLocale="en">
        <Probe />
      </I18nProvider>,
    );
    expect(screen.getByRole('button')).toHaveTextContent('Practice');
    expect(document.documentElement.lang).toBe('en');

    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('Latihan');
    expect(document.documentElement.lang).toBe('ms');
  });

  it('tells the developer when the provider is missing', () => {
    // React logs the thrown error; keep the test output clean.
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Probe />)).toThrow(/I18nProvider/);
    vi.restoreAllMocks();
  });
});
