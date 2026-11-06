/**
 * Content validation for every language pack. Nothing here writes files.
 *
 * Errors (exit code 1):
 * - a required file is missing, isn't valid JSON, or fails its schema
 * - the folder name, `code` and each file's `language` disagree; ids don't start with "<code>-"
 * - duplicate ids (entries, sentences, units, lessons, dialects, speakers)
 * - references that don't resolve: course ids, uiPhrases, taglines, sentence uses,
 *   legacy-id-map, dialects, source keys, speaker codes
 * - an entry introduced in more than one lesson; defaultDialect missing or not selectable
 * - a sentence whose text isn't its tokens joined with spaces (final punctuation ignored)
 * - audio: file missing from audio/, misnamed, or its `form` isn't the entry's form or a variant
 * - a status that claims more speaker reviews of the current form than review[] holds (D008)
 * - an apostrophe look-alike from unifyApostrophes inside a form (golden rule 2)
 *
 * Warnings (reported, never fixed, and they don't fail the check):
 * - entries in no lesson; retired items still in use; audio files nothing points at
 * - odd spacing or non-NFC Unicode in a form; "…" in a form
 * - identical or overlapping English glosses within a unit (bad distractors)
 * - lessons introducing fewer than 3 or more than 8 entries
 * - constructed entries and sentences; a sentence identical to a lexicon phrase
 * - entries whose forms are equal at the loose ("close") level (D015)
 */
import { normalize, type NormalizationRules } from '../../src/engine/normalize';
import type {
  Audio,
  LexiconEntry,
  PackFiles,
  Review,
  Sentence,
  Status,
} from '../../src/content/schema.generated';
import { CONTENT_DIR, SCHEMAS_DIR } from './paths';
import { countBySeverity, IssueList, type Issue } from './issues';
import {
  AUDIO_DIR,
  discoverPacks,
  PACK_FILES,
  readPack,
  REQUIRED_FILES,
  type PackFileKey,
} from './pack';
import { createSchemaValidators, describeSchemaError, type SchemaValidators } from './schemas';

export interface PackStats {
  entries: number;
  byStatus: Record<Status, number>;
  sentences: number;
  units: number;
  lessons: number;
  entriesWithAudio: number;
}

export interface PackReport {
  folder: string;
  dir: string;
  name?: string;
  issues: Issue[];
  stats?: PackStats;
  /** Set only when every file passed its schema, so the data can be trusted by the build. */
  pack?: PackFiles;
}

export interface ContentReport {
  packs: PackReport[];
  /** Problems that belong to no single pack, such as finding no packs at all. */
  issues: Issue[];
  errors: number;
  warnings: number;
}

export interface ValidateOptions {
  contentRoot?: string;
  schemasDir?: string;
}

const F = PACK_FILES;
const AUDIO = `${AUDIO_DIR}/`;

/** Lessons outside this range get a warning. docs/CONTENT_MODEL.md aims for 4–7. */
export const LESSON_SIZE = { min: 3, max: 8 } as const;

/** How many speakers must have said "ok" to the current form (D008). */
const SPEAKERS_NEEDED: Partial<Record<Status, number>> = { 'speaker-checked': 1, verified: 2 };

const DEFAULT_FINAL_PUNCTUATION = '.?!…';

export function validateContent({
  contentRoot = CONTENT_DIR,
  schemasDir = SCHEMAS_DIR,
}: ValidateOptions = {}): ContentReport {
  const validators = createSchemaValidators(schemasDir);
  const packs = discoverPacks(contentRoot).map((dir) => validatePack(dir, validators));
  const top = new IssueList();
  if (packs.length === 0) {
    top.error('content/languages/', 'no-packs', 'No language packs found.');
  }
  const all = [...top.items, ...packs.flatMap((p) => p.issues)];
  return { packs, issues: top.items, ...countBySeverity(all) };
}

export function validatePack(dir: string, validators: SchemaValidators): PackReport {
  const raw = readPack(dir);
  const issues = raw.issues;

  let schemaOk = REQUIRED_FILES.every((key) => raw.raw[key] !== undefined);
  for (const key of Object.keys(F) as PackFileKey[]) {
    const data = raw.raw[key];
    if (data === undefined) continue;
    const validate = validators[key];
    if (!validate(data)) {
      schemaOk = false;
      for (const error of validate.errors ?? []) {
        issues.error(F[key], 'schema', describeSchemaError(error, data));
      }
    }
  }

  const report: PackReport = { folder: raw.folder, dir, issues: issues.items };
  if (!schemaOk) {
    issues.error(
      '(pack)',
      'checks-skipped',
      'Cross-reference and quality checks were skipped. Fix the problems above, then run this again.',
    );
    return report;
  }

  const pack = raw.raw as unknown as PackFiles;
  checkPack(raw.folder, pack, raw.audioFiles, issues);
  report.pack = pack;
  report.name = pack.language.name.en;
  report.stats = statsFor(pack);
  return report;
}

function statsFor(pack: PackFiles): PackStats {
  const byStatus: Record<Status, number> = {
    draft: 0,
    'speaker-checked': 0,
    verified: 0,
    retired: 0,
  };
  for (const e of pack.lexicon.entries) byStatus[e.status] += 1;
  return {
    entries: pack.lexicon.entries.length,
    byStatus,
    sentences: pack.sentences.entries.length,
    units: pack.course.units.length,
    lessons: pack.course.units.reduce((n, u) => n + u.lessons.length, 0),
    entriesWithAudio: pack.lexicon.entries.filter((e) => (e.audio?.length ?? 0) > 0).length,
  };
}

function duplicates(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const v of values) (seen.has(v) ? dupes : seen).add(v);
  return [...dupes];
}

function groupBy<T>(items: readonly T[], key: (item: T) => string | undefined): Map<string, T[]> {
  const out = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    if (k === undefined) continue;
    const list = out.get(k);
    if (list) list.push(item);
    else out.set(k, [item]);
  }
  return out;
}

const quote = (s: string) => `"${s}"`;

/** Every written form of an entry: the main form and its variants. */
function formsOf(entry: LexiconEntry): string[] {
  return [entry.form, ...(entry.variants ?? []).map((v) => v.form)];
}

/**
 * The speakers whose latest review of `form` says "ok". Reviews of an older
 * form don't count (D013), and a later "fix" or "unsure" cancels an earlier "ok".
 */
export function okSpeakers(reviews: readonly Review[] | undefined, form: string): Set<string> {
  const current = form.normalize('NFC');
  const latest = new Map<string, Review>();
  const relevant = (reviews ?? [])
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => r.form.normalize('NFC') === current)
    // Stable by date, then by position, so the last one written wins a tie.
    .sort((a, b) => (a.r.date === b.r.date ? a.i - b.i : a.r.date < b.r.date ? -1 : 1));
  for (const { r } of relevant) latest.set(r.speaker, r);
  return new Set([...latest.values()].filter((r) => r.verdict === 'ok').map((r) => r.speaker));
}

/** Identical glosses: case, spacing and final punctuation don't count. */
function sameGlossKey(gloss: string): string {
  return gloss
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.?!…]+$/, '');
}

/** A gloss split into comparable parts: "they (two people) / them" → ["they", "them"]. */
export function glossParts(gloss: string): string[] {
  return gloss
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .split(/[/,;]/)
    .map((part) =>
      part
        .replace(/[.?!…]/g, ' ')
        .trim()
        .replace(/^(to|a|an|the|i'm|i’m|i am)\s+/, '')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter(Boolean);
}

function checkPack(
  folder: string,
  pack: PackFiles,
  audioFiles: readonly string[],
  issues: IssueList,
): void {
  const { language, lexicon, sentences, course, legacyIdMap } = pack;
  const code = language.code;
  const rules: NormalizationRules = language.orthography.normalization;
  const entries = lexicon.entries;
  const sents = sentences.entries;

  // --- Pack identity -------------------------------------------------------
  if (code !== folder) {
    issues.error(
      F.language,
      'pack-code',
      `code is ${quote(code)} but the folder is named ${quote(folder)}. They must match.`,
    );
  }
  for (const [file, value] of [
    [F.lexicon, lexicon.language],
    [F.sentences, sentences.language],
    [F.course, course.language],
  ] as const) {
    if (value !== code) {
      issues.error(
        file,
        'language-mismatch',
        `language is ${quote(value)} but language.json says ${quote(code)}.`,
      );
    }
  }
  const badEntryIds = entries.filter((e) => !e.id.startsWith(`${code}-`)).map((e) => e.id);
  if (badEntryIds.length)
    issues.error(
      F.lexicon,
      'id-prefix',
      `Entry ids must start with ${quote(`${code}-`)}.`,
      badEntryIds,
    );
  const badSentenceIds = sents.filter((s) => !s.id.startsWith(`${code}-`)).map((s) => s.id);
  if (badSentenceIds.length)
    issues.error(
      F.sentences,
      'id-prefix',
      `Sentence ids must start with ${quote(`${code}-`)}.`,
      badSentenceIds,
    );

  // --- Unique ids -----------------------------------------------------------
  const lessons = course.units.flatMap((u) => u.lessons.map((l) => ({ unit: u, lesson: l })));
  for (const [file, label, ids] of [
    [F.lexicon, 'Entry', entries.map((e) => e.id)],
    [F.sentences, 'Sentence', sents.map((s) => s.id)],
    [F.course, 'Unit', course.units.map((u) => u.id)],
    [F.course, 'Lesson', lessons.map((l) => l.lesson.id)],
    [F.language, 'Dialect', language.dialects.map((d) => d.id)],
    [F.language, 'Speaker code', language.credits.speakers.map((s) => s.code)],
  ] as const) {
    for (const id of duplicates(ids)) {
      issues.error(
        file,
        'duplicate-id',
        `${label} id ${quote(id)} is used more than once. Ids must be unique.`,
        [id],
      );
    }
  }

  const entryById = new Map<string, LexiconEntry>();
  for (const e of entries) if (!entryById.has(e.id)) entryById.set(e.id, e);
  const sentenceById = new Map<string, Sentence>();
  for (const s of sents) if (!sentenceById.has(s.id)) sentenceById.set(s.id, s);
  const isRetired = (id: string) => entryById.get(id)?.status === 'retired';

  // --- Dialects ---------------------------------------------------------------
  const dialectIds = new Set(language.dialects.map((d) => d.id));
  const defaultDialect = language.dialects.find((d) => d.id === language.defaultDialect);
  if (!defaultDialect) {
    issues.error(
      F.language,
      'default-dialect',
      `defaultDialect ${quote(language.defaultDialect)} isn't one of the dialects.`,
    );
  } else if (defaultDialect.selectable === false) {
    issues.error(
      F.language,
      'default-dialect',
      `defaultDialect ${quote(language.defaultDialect)} has selectable: false, so learners couldn't choose it.`,
    );
  }
  const unknownDialects = new Map<string, Map<string, string[]>>();
  const noteDialect = (file: string, dialect: string | null | undefined, id: string) => {
    if (dialect == null || dialectIds.has(dialect)) return;
    const byDialect = unknownDialects.get(file) ?? new Map<string, string[]>();
    byDialect.set(dialect, [...(byDialect.get(dialect) ?? []), id]);
    unknownDialects.set(file, byDialect);
  };
  for (const e of entries) {
    noteDialect(F.lexicon, e.dialect, e.id);
    for (const v of e.variants ?? []) noteDialect(F.lexicon, v.dialect, e.id);
    for (const a of e.audio ?? []) noteDialect(F.lexicon, a.dialect, e.id);
  }
  for (const [key, source] of Object.entries(lexicon.sources))
    noteDialect(F.lexicon, source.dialect, key);
  for (const s of sents) {
    noteDialect(F.sentences, s.dialect, s.id);
    for (const a of s.audio ?? []) noteDialect(F.sentences, a.dialect, s.id);
  }
  for (const sp of language.credits.speakers) noteDialect(F.language, sp.dialect, sp.code);
  const dialectList = [...dialectIds].join(', ');
  for (const [file, byDialect] of unknownDialects) {
    for (const [dialect, ids] of byDialect) {
      issues.error(
        file,
        'unknown-dialect',
        `Unknown dialect ${quote(dialect)}. language.json lists: ${dialectList}.`,
        [...new Set(ids)],
      );
    }
  }

  // --- Sources ----------------------------------------------------------------
  const sourceKeys = new Set(Object.keys(lexicon.sources));
  for (const [file, items] of [
    [F.lexicon, entries],
    [F.sentences, sents],
  ] as const) {
    const unknown = groupBy(
      items.flatMap((item) =>
        item.sources.filter((s) => !sourceKeys.has(s)).map((s) => ({ s, id: item.id })),
      ),
      (x) => x.s,
    );
    for (const [key, list] of unknown) {
      issues.error(
        file,
        'unknown-source',
        `Unknown source ${quote(key)}. Add it to lexicon.json → sources, or fix the key.`,
        list.map((x) => x.id),
      );
    }
  }

  // --- Course references ---------------------------------------------------
  const introducedIn = new Map<string, string[]>();
  for (const { lesson } of lessons) {
    const unknownEntries = lesson.introduce.filter((id) => !entryById.has(id));
    if (unknownEntries.length) {
      issues.error(
        F.course,
        'unknown-entry',
        `Lesson ${quote(lesson.id)} introduces entries that don't exist.`,
        unknownEntries,
      );
    }
    const unknownSentences = (lesson.sentences ?? []).filter((id) => !sentenceById.has(id));
    if (unknownSentences.length) {
      issues.error(
        F.course,
        'unknown-sentence',
        `Lesson ${quote(lesson.id)} lists sentences that don't exist.`,
        unknownSentences,
      );
    }
    for (const id of lesson.introduce)
      introducedIn.set(id, [...(introducedIn.get(id) ?? []), lesson.id]);

    const retired = [
      ...lesson.introduce.filter(isRetired),
      ...(lesson.sentences ?? []).filter((id) => sentenceById.get(id)?.status === 'retired'),
    ];
    if (retired.length) {
      issues.warn(
        F.course,
        'retired-in-use',
        `Lesson ${quote(lesson.id)} lists retired items. They are never shown, so the build leaves them out.`,
        retired,
      );
    }

    const size = lesson.introduce.length;
    if (size < LESSON_SIZE.min || size > LESSON_SIZE.max) {
      issues.warn(
        F.course,
        'lesson-size',
        `Lesson ${quote(lesson.id)} introduces ${size} entries. Aim for 4–7 (fewer than ${LESSON_SIZE.min} or more than ${LESSON_SIZE.max} is flagged).`,
      );
    }
  }
  for (const unit of course.units) {
    const unknownTaglines = (unit.taglineEntries ?? []).filter((id) => !entryById.has(id));
    if (unknownTaglines.length) {
      issues.error(
        F.course,
        'unknown-entry',
        `Unit ${quote(unit.id)} has taglineEntries that don't exist.`,
        unknownTaglines,
      );
    }
    const retiredTaglines = (unit.taglineEntries ?? []).filter(isRetired);
    if (retiredTaglines.length) {
      issues.warn(
        F.course,
        'retired-in-use',
        `Unit ${quote(unit.id)} has retired taglineEntries.`,
        retiredTaglines,
      );
    }
  }
  for (const [id, where] of introducedIn) {
    if (where.length > 1 && entryById.has(id)) {
      issues.error(
        F.course,
        'introduced-twice',
        `Introduced in more than one lesson (${where.join(', ')}). Each entry is introduced exactly once.`,
        [id],
      );
    }
  }
  const notIntroduced = entries
    .filter((e) => e.status !== 'retired' && !introducedIn.has(e.id))
    .map((e) => e.id);
  if (notIntroduced.length) {
    issues.warn(
      F.course,
      'not-introduced',
      'Entries that no lesson introduces, so learners never meet them in a lesson.',
      notIntroduced,
    );
  }

  // --- uiPhrases and the legacy id map -------------------------------------------
  for (const [key, id] of Object.entries(language.uiPhrases)) {
    if (!entryById.has(id)) {
      issues.error(
        F.language,
        'unknown-entry',
        `uiPhrases.${key} points at an entry that doesn't exist.`,
        [id],
      );
    } else if (isRetired(id)) {
      issues.warn(
        F.language,
        'retired-in-use',
        `uiPhrases.${key} points at a retired entry, so the UI falls back to its own text.`,
        [id],
      );
    }
  }
  if (legacyIdMap) {
    const unknown = [...new Set(Object.values(legacyIdMap.map).filter((id) => !entryById.has(id)))];
    if (unknown.length) {
      issues.error(
        F.legacyIdMap,
        'unknown-entry',
        "The map points at entries that don't exist.",
        unknown,
      );
    }
  }

  // --- Sentences ---------------------------------------------------------------
  const finalPunctuation = rules.ignorePunctuation || DEFAULT_FINAL_PUNCTUATION;
  const trimEnd = (text: string) => {
    let out = text.trimEnd();
    while (out && finalPunctuation.includes(out.slice(-1))) out = out.slice(0, -1).trimEnd();
    return out;
  };
  for (const s of sents) {
    const unknownUses = s.uses.filter((id) => !entryById.has(id));
    if (unknownUses.length) {
      issues.error(
        F.sentences,
        'unknown-entry',
        `Sentence ${s.id} uses entries that don't exist: ${unknownUses.join(', ')}.`,
        [s.id],
      );
    }
    const joined = s.tokens.join(' ');
    if (trimEnd(s.text) !== trimEnd(joined)) {
      issues.error(
        F.sentences,
        'text-tokens',
        `text ${quote(s.text)} isn't its tokens joined with spaces (${quote(joined)}).`,
        [s.id],
      );
    }
    const retiredUses = s.uses.filter(isRetired);
    if (retiredUses.length && s.status !== 'retired') {
      issues.warn(
        F.sentences,
        'retired-in-use',
        `Sentence ${s.id} uses retired entries: ${retiredUses.join(', ')}.`,
        [s.id],
      );
    }
  }

  // --- Speakers, reviews, audio and status ---------------------------------------
  const speakerCodes = new Set(language.credits.speakers.map((s) => s.code));
  const audioOnDisk = new Set(audioFiles);
  const audioUsed = new Set<string>();
  const items: {
    file: string;
    id: string;
    status: Status;
    forms: string[];
    review?: Review[];
    audio?: Audio[];
  }[] = [
    ...entries.map((e) => ({
      file: F.lexicon,
      id: e.id,
      status: e.status,
      forms: formsOf(e),
      review: e.review,
      audio: e.audio,
    })),
    ...sents.map((s) => ({
      file: F.sentences,
      id: s.id,
      status: s.status,
      forms: [s.text],
      review: s.review,
      audio: s.audio,
    })),
  ];
  for (const item of items) {
    const unknownSpeakers = new Set(
      [...(item.review ?? []), ...(item.audio ?? [])]
        .map((x) => x.speaker)
        .filter((sp) => !speakerCodes.has(sp)),
    );
    for (const sp of unknownSpeakers) {
      issues.error(
        item.file,
        'unknown-speaker',
        `Speaker ${sp} isn't in language.json → credits.speakers. Add them there (with their consent) before using their reviews or recordings.`,
        [item.id],
      );
    }

    for (const a of item.audio ?? []) {
      audioUsed.add(a.file);
      if (!audioOnDisk.has(a.file)) {
        issues.error(item.file, 'missing-audio', `Audio file ${AUDIO}${a.file} is missing.`, [
          item.id,
        ]);
      }
      if (
        !a.file.startsWith(`${item.id}__${a.speaker}.`) &&
        !a.file.startsWith(`${item.id}__${a.speaker}_`)
      ) {
        issues.error(
          item.file,
          'audio-name',
          `Audio file ${a.file} should be named ${item.id}__${a.speaker}.<ext> (or with _<take>), to match the item and the speaker.`,
          [item.id],
        );
      }
      if (!item.forms.some((f) => f.normalize('NFC') === a.form.normalize('NFC'))) {
        issues.error(
          item.file,
          'audio-form',
          `Audio ${a.file} says ${quote(a.form)}, which isn't this item's form or one of its variants.`,
          [item.id],
        );
      }
    }

    const needed = SPEAKERS_NEEDED[item.status];
    const mainForm = item.forms[0] ?? '';
    if (needed) {
      const found = okSpeakers(item.review, mainForm).size;
      if (found < needed) {
        issues.error(
          item.file,
          'status-unsupported',
          `Status is ${quote(item.status)}, which needs ${needed} different speaker${needed > 1 ? 's' : ''} whose latest review of the current form is "ok". review[] has ${found}.`,
          [item.id],
        );
      }
    }
  }
  const unusedAudio = audioFiles.filter((f) => !audioUsed.has(f));
  if (unusedAudio.length) {
    issues.warn(
      AUDIO,
      'unused-audio',
      `Files that no entry or sentence points at: ${unusedAudio.join(', ')}.`,
    );
  }

  // --- Written forms ------------------------------------------------------------
  const lookAlikes = (rules.unifyApostrophes ?? []).filter((ch) => ch && ch !== "'");
  const textsOf = (file: string) =>
    file === F.lexicon
      ? entries.map((e) => ({ id: e.id, texts: formsOf(e) }))
      : sents.map((s) => ({ id: s.id, texts: [s.text, ...s.tokens] }));
  for (const file of [F.lexicon, F.sentences]) {
    const apostrophes: string[] = [];
    const spacing: string[] = [];
    const nfc: string[] = [];
    const ellipsis: string[] = [];
    for (const { id, texts } of textsOf(file)) {
      if (texts.some((t) => lookAlikes.some((ch) => t.includes(ch)))) apostrophes.push(id);
      if (texts.some((t) => t !== t.trim() || /\s{2}|[^\S ]/u.test(t))) spacing.push(id);
      if (texts.some((t) => t !== t.normalize('NFC'))) nfc.push(id);
      if (file === F.lexicon && texts.some((t) => t.includes('…') || t.includes('...')))
        ellipsis.push(id);
    }
    if (apostrophes.length) {
      issues.error(
        file,
        'non-ascii-apostrophe',
        `Uses an apostrophe look-alike (${lookAlikes.join(' ')}) instead of the plain ASCII apostrophe ('). Ask the owner before changing the form (golden rule 2).`,
        apostrophes,
      );
    }
    if (spacing.length) {
      issues.warn(
        file,
        'spacing',
        'Extra, leading, trailing or unusual spaces in a form. Reported only: check with the owner before changing anything.',
        spacing,
      );
    }
    if (nfc.length) {
      issues.warn(
        file,
        'not-nfc',
        'A form uses decomposed accents (not Unicode NFC). It looks the same but may not match typed answers. Reported only.',
        nfc,
      );
    }
    if (ellipsis.length) {
      issues.warn(
        file,
        'ellipsis-in-form',
        'The form contains "…", which looks like a blank to fill in. Typing exercises would ask learners to type it.',
        ellipsis,
      );
    }
  }

  // --- Content quality ----------------------------------------------------------
  const constructedEntries = entries
    .filter((e) => e.constructed && e.status !== 'retired')
    .map((e) => e.id);
  if (constructedEntries.length) {
    issues.warn(
      F.lexicon,
      'constructed',
      'Constructed (assembled from dictionary words, not taken from a speaker or source). A speaker must check these before release.',
      constructedEntries,
    );
  }
  const constructedSentences = sents
    .filter((s) => s.constructed && s.status !== 'retired')
    .map((s) => s.id);
  if (constructedSentences.length) {
    issues.warn(
      F.sentences,
      'constructed',
      'Constructed sentences. A speaker must check these before release.',
      constructedSentences,
    );
  }

  const phraseByKey = groupBy(
    entries.filter((e) => e.kind === 'phrase' && e.status !== 'retired'),
    (e) => normalize(e.form, rules),
  );
  for (const s of sents) {
    const same = phraseByKey.get(normalize(s.text, rules));
    if (same?.length && s.status !== 'retired') {
      issues.warn(
        F.sentences,
        'sentence-is-phrase',
        `Sentence ${s.id} is the same as lexicon phrase ${same.map((e) => e.id).join(', ')}, so it would be taught twice.`,
        [s.id, ...same.map((e) => e.id)],
      );
    }
  }

  for (const unit of course.units) {
    const unitEntries = unit.lessons
      .flatMap((l) => l.introduce)
      .map((id) => entryById.get(id))
      .filter((e): e is LexiconEntry => !!e && e.status !== 'retired');
    const reported = new Set<string>();
    const byGloss = groupBy(unitEntries, (e) => sameGlossKey(e.gloss.en) || undefined);
    for (const [gloss, list] of byGloss) {
      const ids = [...new Set(list.map((e) => e.id))];
      if (ids.length < 2) continue;
      reported.add(ids.join());
      issues.warn(
        F.course,
        'same-gloss',
        `Unit ${quote(unit.id)}: the same English gloss ${quote(gloss)}, so they can't be told apart as answer options.`,
        ids,
      );
    }
    const byPart = groupBy(
      unitEntries.flatMap((e) => glossParts(e.gloss.en).map((part) => ({ part, e }))),
      (x) => x.part,
    );
    for (const [part, list] of byPart) {
      const ids = [...new Set(list.map((x) => x.e.id))];
      if (ids.length < 2 || reported.has(ids.join())) continue;
      reported.add(ids.join());
      issues.warn(
        F.course,
        'overlapping-gloss',
        `Unit ${quote(unit.id)}: English glosses overlap on ${quote(part)}, which makes confusing answer options.`,
        ids,
      );
    }
  }

  const looseChars = [
    ...(rules.ignoreInLooseMatch ?? []),
    ...Object.keys(rules.looseEquivalents ?? {}),
  ];
  const byLoose = groupBy(
    entries
      .filter((e) => e.status !== 'retired')
      .flatMap((e) =>
        formsOf(e).map((form) => ({ e, form, key: normalize(form, rules, 'loose') })),
      ),
    (x) => x.key || undefined,
  );
  const collisions = new Set<string>();
  for (const [key, list] of byLoose) {
    const ids = [...new Set(list.map((x) => x.e.id))];
    if (ids.length < 2 || collisions.has(ids.join())) continue;
    collisions.add(ids.join());
    const forms = [...new Set(list.map((x) => x.form))];
    const exact = new Set(list.map((x) => normalize(x.form, rules)));
    const message =
      exact.size === 1
        ? `The same written form (${forms.map(quote).join(', ')}) belongs to different entries, so a typed answer can't tell them apart.`
        : `Forms that differ only in characters the "close" match ignores (${looseChars.join(' ')}): ${forms.map(quote).join(', ')}. A typed ${quote(key)} is "close" to each of them (D015).`;
    issues.warn(F.lexicon, 'loose-collision', message, ids);
  }
}
