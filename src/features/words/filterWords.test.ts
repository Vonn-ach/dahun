import { describe, expect, it } from 'vitest';
import { createCourse } from '../../content';
import { testBundle } from '../../test/content';
import { filterWords, indexWords } from './filterWords';

const course = createCourse(testBundle);
const words = indexWords(course);
const rules = testBundle.orthography.normalization;
const ids = (query: string, unitId: string | null = null) =>
  filterWords(words, { query, unitId }, rules).map((e) => e.id);

describe('filterWords', () => {
  it('returns every entry for an empty search', () => {
    expect(ids('')).toHaveLength(testBundle.entries.length);
    expect(ids('   ')).toHaveLength(testBundle.entries.length);
  });

  it('finds forms without the apostrophe, accents or case', () => {
    expect(ids('BRAVO')).toEqual(['tst-0002']);
    expect(ids("bravo'")).toEqual(['tst-0002']);
    expect(ids('echo')).toEqual(['tst-0005']);
  });

  it('finds variants', () => {
    expect(ids('charly')).toEqual(['tst-0003']);
    expect(ids('charlee')).toEqual(['tst-0003']);
  });

  it('finds English and Malay glosses', () => {
    expect(ids('river')).toEqual(['tst-0002']);
    expect(ids('Pokok')).toEqual(['tst-0004']);
  });

  it('filters by unit, alone or with a search', () => {
    expect(ids('', 'more')).toEqual(['tst-0004', 'tst-0005', 'tst-0006']);
    expect(ids('river', 'more')).toEqual([]);
  });

  it('does not treat a search of only ignored characters as a form match', () => {
    expect(ids('?')).toEqual([]);
  });
});
