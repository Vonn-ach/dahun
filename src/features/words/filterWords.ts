import type { BundleEntry, Course } from '../../content';
import { searchKey, type NormalizationRules } from '../../engine';

export interface IndexedWord {
  entry: BundleEntry;
  unitId: string | undefined;
  /** Search keys for the form and every variant, using the language's own rules. */
  formKeys: string[];
  /** Search keys for the English and Malay glosses. */
  glossKeys: string[];
}

export interface WordFilter {
  query: string;
  /** Only entries a lesson in this unit introduces; null for every entry. */
  unitId: string | null;
}

/** Lowercase, no accents, single spaces: enough for English and Malay glosses. */
function plainKey(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/gu, ' ').trim();
}

/** Builds the search keys once per course, not on every keystroke. */
export function indexWords(course: Course): IndexedWord[] {
  const rules = course.bundle.orthography.normalization;
  return course.entries.map((entry) => ({
    entry,
    unitId: course.unitOfEntry(entry.id)?.id,
    formKeys: [entry.form, ...(entry.variants ?? []).map((v) => v.form)].map((f) =>
      searchKey(f, rules),
    ),
    glossKeys: [entry.gloss.en, entry.gloss.ms].map(plainKey),
  }));
}

/**
 * Entries matching the search text and the unit. Forms are compared loosely
 * (no accents, apostrophes or listed punctuation), so a learner can find a
 * word without typing it exactly. Nothing about the forms is changed.
 */
export function filterWords(
  words: readonly IndexedWord[],
  { query, unitId }: WordFilter,
  rules: NormalizationRules,
): BundleEntry[] {
  const formQuery = searchKey(query, rules);
  const glossQuery = plainKey(query);
  return words
    .filter((w) => unitId === null || w.unitId === unitId)
    .filter((w) => {
      if (!glossQuery) return true;
      return (
        (formQuery !== '' && w.formKeys.some((k) => k.includes(formQuery))) ||
        w.glossKeys.some((k) => k.includes(glossQuery))
      );
    })
    .map((w) => w.entry);
}
