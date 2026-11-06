/**
 * The answer-matching rules from language.json → orthography.normalization.
 * Declared here rather than imported from the content types so the engine
 * stays free of content-loading code.
 */
export interface NormalizationRules {
  lowercase: boolean;
  unifyApostrophes?: readonly string[];
  stripDiacritics?: boolean;
  ignorePunctuation?: string;
  ignoreInLooseMatch?: readonly string[];
  looseEquivalents?: Readonly<Record<string, string>>;
}

/** "exact" and "loose" are the two comparison keys behind exact / close answers. */
export type MatchLevel = 'exact' | 'loose';

const APOSTROPHE = "'";

function removeAll(text: string, chars: Iterable<string>): string {
  let out = text;
  for (const ch of chars) if (ch) out = out.split(ch).join('');
  return out;
}

function tidySpaces(text: string): string {
  return text.trim().replace(/\s+/gu, ' ');
}

/**
 * Turns a form or a typed answer into a comparison key. Only the characters a
 * language lists are removed: never a general punctuation class, which would
 * also remove the glottal stop (D011). Content is never changed; this only
 * produces keys to compare.
 */
export function normalize(
  text: string,
  rules: NormalizationRules,
  level: MatchLevel = 'exact',
): string {
  const lower = (s: string) => (rules.lowercase ? s.toLowerCase() : s);

  let out = lower(text.normalize('NFC'));
  for (const ch of rules.unifyApostrophes ?? []) out = out.split(ch).join(APOSTROPHE);
  if (rules.stripDiacritics) out = out.normalize('NFD').replace(/\p{M}/gu, '').normalize('NFC');
  // Spread so a punctuation mark outside the BMP is treated as one character.
  out = removeAll(out, [...(rules.ignorePunctuation ?? '')]);
  out = tidySpaces(out);
  if (level === 'exact') return out;

  out = removeAll(out, rules.ignoreInLooseMatch ?? []);
  for (const [from, to] of Object.entries(rules.looseEquivalents ?? {})) {
    const key = lower(from.normalize('NFC'));
    if (key) out = out.split(key).join(to);
  }
  return tidySpaces(out);
}

/**
 * The most forgiving key, for search boxes: loose matching plus no accents,
 * whatever the language's own setting for typed answers.
 */
export function searchKey(text: string, rules: NormalizationRules): string {
  return normalize(text, { ...rules, lowercase: true, stripDiacritics: true }, 'loose');
}
