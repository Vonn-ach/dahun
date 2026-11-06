/**
 * The shape of a content bundle: what scripts/build-content.ts writes to
 * src/generated/<code>.bundle.json and what the app loads. It is the content
 * files after filtering by status, with speaker reviews and internal source
 * notes left out. The file types themselves come from the schemas.
 */
import type {
  Dialect,
  LanguageFile,
  Lesson,
  LexiconEntry,
  Sentence,
  Source,
  Unit,
} from './schema.generated';

export type {
  Audio,
  Dialect,
  LanguageFile,
  LanguageName,
  Lesson,
  LexiconEntry,
  Localized,
  LocalizedBoth,
  Normalization,
  Orthography,
  Sentence,
  SpeakerCredit,
  Status,
  Unit,
  Variant,
} from './schema.generated';

/**
 * Which statuses a build includes:
 * - release: verified only
 * - beta: verified and speaker-checked (RELEASE_ALLOW_SPEAKER_CHECKED=1, D008)
 * - draft: everything except retired (dev server and the labelled preview, D007)
 */
export type Channel = 'release' | 'beta' | 'draft';

/** Bumped when the bundle shape changes in a way old code can't read. */
export const BUNDLE_FORMAT = 1;

export type BundleEntry = Omit<LexiconEntry, 'review'>;
export type BundleSentence = Omit<Sentence, 'review'>;
export type BundleDialect = Omit<Dialect, 'selectable'> & { selectable: boolean };
export type BundleSource = Pick<Source, 'title' | 'author' | 'year' | 'url'>;
export type BundleLesson = Required<Lesson>;
export type BundleUnit = Omit<Unit, 'taglineEntries' | 'lessons'> & {
  taglineEntries: string[];
  lessons: BundleLesson[];
};

export interface BundleStats {
  /** Entries in the pack that aren't retired, whatever their status. */
  totalEntries: number;
  verifiedEntries: number;
  /** Entries in this bundle. */
  includedEntries: number;
  totalLessons: number;
  includedLessons: number;
}

export interface Bundle {
  format: typeof BUNDLE_FORMAT;
  channel: Channel;
  code: string;
  name: LanguageFile['name'];
  region?: string;
  status: LanguageFile['status'];
  dialects: BundleDialect[];
  defaultDialect: string;
  orthography: LanguageFile['orthography'];
  /** Only phrases whose entries are in this bundle (D012). */
  uiPhrases: Record<string, string>;
  credits: LanguageFile['credits'];
  /** Only the sources that included entries and sentences cite. */
  sources: Record<string, BundleSource>;
  entries: BundleEntry[];
  sentences: BundleSentence[];
  units: BundleUnit[];
  stats: BundleStats;
}

/** One row of the generated language list, available before any bundle loads. */
export interface LanguageSummary {
  code: string;
  name: LanguageFile['name'];
  status: LanguageFile['status'];
  stats: BundleStats;
}
