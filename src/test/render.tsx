import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';
import { ContentProvider, type ContentSource } from '../content';
import { I18nProvider, type Locale } from '../i18n';
import { staticSource, testBundle } from './content';

interface Options {
  locale?: Locale;
  route?: string;
  /** Defaults to the fixture course, already loaded, in a draft build. */
  content?: ContentSource;
}

/** Renders a component with the providers every screen and UI piece expects. */
export function renderWithProviders(
  ui: ReactElement,
  { locale = 'en', route = '/', content = staticSource([testBundle]) }: Options = {},
): RenderResult {
  return render(
    <I18nProvider initialLocale={locale}>
      <ContentProvider source={content}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </ContentProvider>
    </I18nProvider>,
  );
}
