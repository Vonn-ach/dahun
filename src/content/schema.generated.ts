/* Generated from schemas/ by scripts/gen-types.ts. Do not edit by hand:
 * change the schema, then run `npm run gen:types`. A test fails if this file is stale. */

export type Status = 'draft' | 'speaker-checked' | 'verified' | 'retired';

/**
 * The files of one language pack, as read from content/languages/<code>/
 */
export interface PackFiles {
  language: LanguageFile;
  lexicon: LexiconFile;
  sentences: SentencesFile;
  course: CourseFile;
  legacyIdMap?: LegacyIdMapFile;
}
export interface LanguageFile {
  $schema?: string;
  /**
   * ISO 639-3 code
   */
  code: string;
  name: LanguageName;
  region?: string;
  dialects: Dialect[];
  defaultDialect: string;
  orthography: Orthography;
  /**
   * Short target-language phrases the UI may show, referenced by entry id
   */
  uiPhrases: {
    [k: string]: string;
  };
  credits: Credits;
  status: 'planning' | 'draft' | 'beta' | 'live';
}
export interface LanguageName {
  native?: string;
  en: string;
  ms: string;
}
export interface Dialect {
  id: string;
  name: LocalizedBoth;
  /**
   * ISO 639-3 code
   */
  iso?: string;
  description?: Localized;
  /**
   * false for labels such as 'shared / not yet checked' that a learner cannot choose as their dialect
   */
  selectable?: boolean;
}
export interface LocalizedBoth {
  en: string;
  ms: string;
}
export interface Localized {
  en: string;
  ms?: string;
}
export interface Orthography {
  notes?: Localized;
  /**
   * Characters the UI highlights, e.g. the glottal stop
   */
  highlight?: string[];
  normalization: Normalization;
}
export interface Normalization {
  lowercase: boolean;
  unifyApostrophes?: string[];
  stripDiacritics?: boolean;
  ignorePunctuation?: string;
  ignoreInLooseMatch?: string[];
  /**
   * Characters treated as equal only in the loose ('close') match, e.g. {"é": "e"}, so a missing accent gets a spelling nudge instead of counting as exact
   */
  looseEquivalents?: {
    [k: string]: string;
  };
}
export interface Credits {
  partner?: string | null;
  speakers: SpeakerCredit[];
}
export interface SpeakerCredit {
  code: string;
  /**
   * Exactly as the speaker asked to be credited: a name, initials, or 'Anonymous'
   */
  credit: string;
  dialect?: string;
}
export interface LexiconFile {
  $schema?: string;
  /**
   * ISO 639-3 code
   */
  language: string;
  sources: {
    [k: string]: Source;
  };
  entries: LexiconEntry[];
}
export interface Source {
  title: string;
  author?: string;
  year?: number;
  url?: string;
  dialect?: string | null;
  licence: string;
  notes?: string;
}
export interface LexiconEntry {
  id: string;
  form: string;
  kind: 'word' | 'phrase';
  pos?:
    | 'noun'
    | 'verb'
    | 'adjective'
    | 'pronoun'
    | 'number'
    | 'question'
    | 'particle'
    | 'phrase'
    | 'other';
  gloss: LocalizedBoth;
  dialect: string;
  variants?: Variant[];
  note?: Localized;
  /**
   * @minItems 1
   */
  sources: string[];
  constructed: boolean;
  status: Status;
  review?: Review[];
  audio?: Audio[];
  malayCognate?: boolean;
  tags?: string[];
}
export interface Variant {
  form: string;
  dialect?: string;
  note?: string;
}
export interface Review {
  /**
   * Speaker code, never a real name
   */
  speaker: string;
  date: string;
  /**
   * The form the speaker reviewed (a sentence's text). The review counts towards status only while this equals the current form (D013).
   */
  form: string;
  verdict: 'ok' | 'fix' | 'unsure';
  comment?: string;
  assistedBy?: 'ai' | 'human';
}
export interface Audio {
  /**
   * <entry or sentence id>__<speaker code>[_<take>].<ext>, inside the pack's audio/ folder
   */
  file: string;
  speaker: string;
  /**
   * The written form the clip says: the entry's form or one of its variants (a sentence's text)
   */
  form: string;
  dialect?: string;
}
export interface SentencesFile {
  $schema?: string;
  /**
   * ISO 639-3 code
   */
  language: string;
  entries: Sentence[];
}
export interface Sentence {
  id: string;
  /**
   * @minItems 1
   */
  tokens: string[];
  text: string;
  gloss: LocalizedBoth;
  dialect: string;
  uses: string[];
  /**
   * @minItems 1
   */
  sources: string[];
  constructed: boolean;
  status: Status;
  review?: Review[];
  audio?: Audio[];
}
export interface CourseFile {
  $schema?: string;
  /**
   * ISO 639-3 code
   */
  language: string;
  units: Unit[];
}
export interface Unit {
  id: string;
  title: LocalizedBoth;
  taglineEntries?: string[];
  lessons: Lesson[];
}
export interface Lesson {
  id: string;
  title: LocalizedBoth;
  /**
   * @minItems 1
   */
  introduce: string[];
  sentences?: string[];
}
export interface LegacyIdMapFile {
  $schema?: string;
  _note?: string;
  /**
   * The backup's `app` value this map applies to
   */
  app: string;
  map: {
    [k: string]: string;
  };
}
