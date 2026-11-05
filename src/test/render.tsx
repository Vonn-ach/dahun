import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';
import { I18nProvider, type Locale } from '../i18n';

interface Options {
  locale?: Locale;
  route?: string;
}

/** Renders a component with the providers every screen and UI piece expects. */
export function renderWithProviders(
  ui: ReactElement,
  { locale = 'en', route = '/' }: Options = {},
): RenderResult {
  return render(
    <I18nProvider initialLocale={locale}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </I18nProvider>,
  );
}
