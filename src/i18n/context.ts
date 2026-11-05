import { createContext } from 'react';
import type { Locale, MessageKey, MessageVars } from './translate';

export type TranslateFn = (key: MessageKey, vars?: MessageVars) => string;

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
}

export const I18nContext = createContext<I18nContextValue | null>(null);
