import { describe, expect, it } from 'vitest';
import { normalize, searchKey, type NormalizationRules } from './normalize';

// Placeholder strings, not real words in any language.
const rules: NormalizationRules = {
  lowercase: true,
  unifyApostrophes: ['’', 'ʼ', '`'],
  stripDiacritics: false,
  ignorePunctuation: '?!.,…',
  ignoreInLooseMatch: ["'"],
  looseEquivalents: { é: 'e' },
};

describe('normalize', () => {
  it('lowercases, trims and collapses spaces', () => {
    expect(normalize('  Abc   DEF ', rules)).toBe('abc def');
  });

  it('turns apostrophe look-alikes into the ASCII apostrophe', () => {
    expect(normalize('ab’c', rules)).toBe("ab'c");
    expect(normalize('abʼc', rules)).toBe("ab'c");
    expect(normalize('ab`c', rules)).toBe("ab'c");
  });

  it('removes only the listed punctuation and keeps the apostrophe', () => {
    expect(normalize("Abc'? de!", rules)).toBe("abc' de");
    expect(normalize('a-b;c', rules)).toBe('a-b;c');
  });

  it('keeps the apostrophe and accents at the exact level', () => {
    expect(normalize("abé'", rules)).toBe("abé'");
  });

  it('drops ignored characters and applies equivalents at the loose level', () => {
    expect(normalize("abé'", rules, 'loose')).toBe('abe');
    expect(normalize('ABÉ', rules, 'loose')).toBe('abe');
  });

  it('treats composed and decomposed accents the same', () => {
    const decomposed = `abe${String.fromCharCode(0x301)}`;
    expect(normalize(decomposed, rules)).toBe(normalize('abé', rules));
  });

  it('strips accents when the language asks for it', () => {
    expect(normalize('abé', { ...rules, stripDiacritics: true })).toBe('abe');
  });

  it('respects lowercase: false', () => {
    expect(normalize('Abc', { lowercase: false })).toBe('Abc');
  });

  it('works with no optional rules at all', () => {
    expect(normalize(" Ab'c. ", { lowercase: true }, 'loose')).toBe("ab'c.");
  });
});

describe('searchKey', () => {
  it('ignores case, accents, apostrophes and listed punctuation', () => {
    expect(searchKey("Ábc'd?", { ...rules, looseEquivalents: {} })).toBe('abcd');
  });
});
