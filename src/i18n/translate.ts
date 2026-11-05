import en from './en.json';
import ms from './ms.json';

export type MessageKey = keyof typeof en;
export type Locale = 'en' | 'ms';
export type MessageVars = Readonly<Record<string, string | number>>;

export const LOCALES: readonly Locale[] = ['en', 'ms'];
export const DEFAULT_LOCALE: Locale = 'en';

// English is the source of truth for keys. Other catalogues may lag behind;
// a missing key falls back to English instead of showing the raw key.
const catalogs: Record<Locale, Partial<Record<MessageKey, string>>> = { en, ms };

export function translate(locale: Locale, key: MessageKey, vars?: MessageVars): string {
  const template = catalogs[locale][key] ?? en[key];
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = vars[name];
    return value === undefined ? match : String(value);
  });
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Picks the first supported UI language from the browser's preference list. */
export function detectLocale(preferred: readonly string[]): Locale {
  for (const tag of preferred) {
    const base = tag.toLowerCase().split('-')[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}
