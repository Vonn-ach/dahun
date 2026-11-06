// Fixture content for component tests. "tst" (Testish) is not a real language:
// its forms are placeholder words, never text from any Borneo language.
import type { Bundle, BundleEntry, Channel, ContentSource } from '../content';

const entry = (
  fields: Partial<BundleEntry> & Pick<BundleEntry, 'id' | 'form' | 'gloss'>,
): BundleEntry => ({
  kind: 'word',
  dialect: 'north',
  sources: ['test-list'],
  constructed: false,
  status: 'draft',
  ...fields,
});

export const testBundle: Bundle = {
  format: 1,
  channel: 'draft',
  code: 'tst',
  name: { native: 'Testish', en: 'Testish', ms: 'Bahasa Ujian' },
  status: 'draft',
  dialects: [
    { id: 'north', name: { en: 'North Testish', ms: 'Testish Utara' }, selectable: true },
    { id: 'south', name: { en: 'South Testish', ms: 'Testish Selatan' }, selectable: true },
    { id: 'shared', name: { en: 'Shared', ms: 'Umum' }, selectable: false },
  ],
  defaultDialect: 'north',
  orthography: {
    highlight: ["'"],
    normalization: { lowercase: true, ignorePunctuation: '?!.,', ignoreInLooseMatch: ["'"] },
  },
  uiPhrases: {},
  credits: { partner: null, speakers: [] },
  sources: {
    'test-list': { title: 'Test word list' },
    'test-notes': { title: 'Test field notes' },
  },
  entries: [
    entry({ id: 'tst-0001', form: 'alfa', gloss: { en: 'stone', ms: 'batu' }, status: 'verified' }),
    entry({
      id: 'tst-0002',
      form: "bravo'",
      gloss: { en: 'river', ms: 'sungai' },
      dialect: 'shared',
      sources: ['test-list', 'test-notes'],
    }),
    entry({
      id: 'tst-0003',
      form: 'charlie',
      gloss: { en: 'house', ms: 'rumah' },
      dialect: 'south',
      variants: [{ form: 'charly', dialect: 'north' }, { form: 'charlee' }],
      status: 'speaker-checked',
    }),
    entry({ id: 'tst-0004', form: 'delta', gloss: { en: 'tree', ms: 'pokok' } }),
    entry({
      id: 'tst-0005',
      form: 'écho',
      kind: 'phrase',
      gloss: { en: 'good day', ms: 'selamat siang' },
    }),
    entry({ id: 'tst-0006', form: 'golf', gloss: { en: 'fish', ms: 'ikan' } }),
  ],
  sentences: [],
  units: [
    {
      id: 'basics',
      title: { en: 'Basics', ms: 'Asas' },
      taglineEntries: ['tst-0001'],
      lessons: [
        {
          id: 'basics-1',
          title: { en: 'Basics 1', ms: 'Asas 1' },
          introduce: ['tst-0001', 'tst-0002', 'tst-0003'],
          sentences: [],
        },
      ],
    },
    {
      id: 'more',
      title: { en: 'More', ms: 'Lagi' },
      taglineEntries: [],
      lessons: [
        {
          id: 'more-1',
          title: { en: 'More 1', ms: 'Lagi 1' },
          introduce: ['tst-0004', 'tst-0005', 'tst-0006'],
          sentences: [],
        },
      ],
    },
  ],
  stats: {
    totalEntries: 6,
    verifiedEntries: 1,
    includedEntries: 6,
    totalLessons: 2,
    includedLessons: 2,
  },
};

/** What a release build looks like before any entry is verified. */
export const emptyBundle: Bundle = {
  ...testBundle,
  channel: 'release',
  entries: [],
  units: [],
  sources: {},
  stats: { ...testBundle.stats, verifiedEntries: 0, includedEntries: 0, includedLessons: 0 },
};

/** A source with the bundles already in memory, so screens render without suspending. */
export function staticSource(
  bundles: readonly Bundle[],
  channel: Channel = 'draft',
): ContentSource {
  return {
    channel,
    languages: bundles.map(({ code, name, status, stats }) => ({ code, name, status, stats })),
    load(code) {
      const bundle = bundles.find((b) => b.code === code);
      if (!bundle) throw new Error(`No fixture bundle for "${code}"`);
      return bundle;
    },
  };
}
