import { describe, expect, it } from 'vitest';
import en from './en.json';
import ms from './ms.json';
import { detectLocale, translate } from './translate';

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe('translate', () => {
  it('returns the string for the locale', () => {
    expect(translate('en', 'nav.learn')).toBe('Learn');
    expect(translate('ms', 'nav.learn')).toBe('Belajar');
  });

  it('fills in placeholders and leaves unknown ones visible', () => {
    expect(translate('en', 'app.documentTitle', { page: 'Words', app: 'Dahun' })).toBe(
      'Words · Dahun',
    );
    expect(translate('en', 'app.documentTitle', { page: 'Words' })).toBe('Words · {app}');
  });
});

describe('detectLocale', () => {
  it('picks the first supported language, ignoring region', () => {
    expect(detectLocale(['ms-MY', 'en-GB'])).toBe('ms');
    expect(detectLocale(['fr-FR', 'en-US'])).toBe('en');
  });

  it('falls back to English', () => {
    expect(detectLocale([])).toBe('en');
    expect(detectLocale(['zh-CN'])).toBe('en');
  });
});

describe('message catalogues', () => {
  const enKeys = Object.keys(en).sort();

  it('Malay has exactly the same keys as English', () => {
    expect(Object.keys(ms).sort()).toEqual(enKeys);
  });

  it('Malay uses the same placeholders as English', () => {
    for (const key of enKeys) {
      const k = key as keyof typeof en;
      expect(placeholders(ms[k]), key).toEqual(placeholders(en[k]));
    }
  });

  it('has no empty strings', () => {
    for (const [key, value] of [...Object.entries(en), ...Object.entries(ms)]) {
      expect(value.trim(), key).not.toBe('');
    }
  });
});
