import type { Locale } from '../i18n';

/** Picks the UI-language text from a content field such as a gloss or a title, falling back to English. */
export function localize(text: { en: string; ms?: string }, locale: Locale): string {
  return text[locale] ?? text.en;
}
