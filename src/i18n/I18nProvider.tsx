import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { I18nContext, type I18nContextValue } from './context';
import { detectLocale, translate, type Locale } from './translate';

interface I18nProviderProps {
  children: ReactNode;
  /** Fixed starting locale (tests, or a saved setting from prompt 05). */
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(
    () => initialLocale ?? detectLocale(globalThis.navigator?.languages ?? []),
  );

  // Screen readers pick their voice from <html lang>, so keep it in step with the UI.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback<I18nContextValue['t']>(
    (key, vars) => translate(locale, key, vars),
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
