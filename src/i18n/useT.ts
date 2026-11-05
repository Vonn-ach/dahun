import { useContext } from 'react';
import { I18nContext, type I18nContextValue, type TranslateFn } from './context';

function useI18n(): I18nContextValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useT() must be used inside <I18nProvider>.');
  return value;
}

/** Returns the translate function for the current UI language. */
export function useT(): TranslateFn {
  return useI18n().t;
}

/** Current UI language and a setter (used by the settings screen). */
export function useLocale(): Pick<I18nContextValue, 'locale' | 'setLocale'> {
  const { locale, setLocale } = useI18n();
  return { locale, setLocale };
}
