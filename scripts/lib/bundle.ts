import type { PackFiles, Status } from '../../src/content/schema.generated';
import {
  BUNDLE_FORMAT,
  type Bundle,
  type BundleEntry,
  type BundleSentence,
  type BundleSource,
  type BundleUnit,
  type Channel,
  type LanguageSummary,
} from '../../src/content/types';

export const INCLUDED_STATUSES: Record<Channel, ReadonlySet<Status>> = {
  release: new Set(['verified']),
  beta: new Set(['verified', 'speaker-checked']),
  draft: new Set(['verified', 'speaker-checked', 'draft']),
};

/** Fewer than this and match-pairs and distractors stop working (D012). */
export const MIN_LESSON_ENTRIES = 3;

export function channelFor({
  includeDrafts,
  allowSpeakerChecked,
}: {
  includeDrafts: boolean;
  allowSpeakerChecked: boolean;
}): Channel {
  if (includeDrafts) return 'draft';
  return allowSpeakerChecked ? 'beta' : 'release';
}

/**
 * Filters one validated pack by status and drops whatever that would leave
 * incomplete (D012). Pure: it neither reads nor writes files. The app only
 * ever sees what this returns, so an excluded form can't appear anywhere,
 * not even as a wrong answer option.
 */
export function buildBundle(pack: PackFiles, channel: Channel): Bundle {
  const { language, lexicon, sentences, course } = pack;
  const included = INCLUDED_STATUSES[channel];

  const entries: BundleEntry[] = lexicon.entries
    .filter((e) => included.has(e.status))
    .map(({ review: _review, audio, ...rest }) => ({
      ...rest,
      ...(audio?.length ? { audio } : {}),
    }));
  const entryIds = new Set(entries.map((e) => e.id));

  const sentenceList: BundleSentence[] = sentences.entries
    .filter((s) => included.has(s.status))
    .map(({ review: _review, audio, uses, ...rest }) => ({
      ...rest,
      uses: uses.filter((id) => entryIds.has(id)),
      ...(audio?.length ? { audio } : {}),
    }));
  const sentenceIds = new Set(sentenceList.map((s) => s.id));

  const units: BundleUnit[] = course.units
    .map((unit) => ({
      id: unit.id,
      title: unit.title,
      taglineEntries: (unit.taglineEntries ?? []).filter((id) => entryIds.has(id)),
      lessons: unit.lessons
        .map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          introduce: lesson.introduce.filter((id) => entryIds.has(id)),
          sentences: (lesson.sentences ?? []).filter((id) => sentenceIds.has(id)),
        }))
        .filter((lesson) => lesson.introduce.length >= MIN_LESSON_ENTRIES),
    }))
    .filter((unit) => unit.lessons.length > 0);

  const uiPhrases = Object.fromEntries(
    Object.entries(language.uiPhrases).filter(([, id]) => entryIds.has(id)),
  );

  // Only what the Credits screen needs. Licence notes and internal notes stay in the repo.
  const cited = new Set([...entries, ...sentenceList].flatMap((item) => item.sources));
  const sources: Record<string, BundleSource> = {};
  for (const [key, source] of Object.entries(lexicon.sources)) {
    if (!cited.has(key)) continue;
    const { title, author, year, url } = source;
    sources[key] = {
      title,
      ...(author !== undefined ? { author } : {}),
      ...(year !== undefined ? { year } : {}),
      ...(url !== undefined ? { url } : {}),
    };
  }

  const live = lexicon.entries.filter((e) => e.status !== 'retired');
  return {
    format: BUNDLE_FORMAT,
    channel,
    code: language.code,
    name: language.name,
    ...(language.region !== undefined ? { region: language.region } : {}),
    status: language.status,
    dialects: language.dialects.map(({ selectable, ...d }) => ({
      ...d,
      selectable: selectable ?? true,
    })),
    defaultDialect: language.defaultDialect,
    orthography: language.orthography,
    uiPhrases,
    credits: language.credits,
    sources,
    entries,
    sentences: sentenceList,
    units,
    stats: {
      totalEntries: live.length,
      verifiedEntries: live.filter((e) => e.status === 'verified').length,
      includedEntries: entries.length,
      totalLessons: course.units.reduce((n, u) => n + u.lessons.length, 0),
      includedLessons: units.reduce((n, u) => n + u.lessons.length, 0),
    },
  };
}

export function summarize(bundle: Bundle): LanguageSummary {
  return { code: bundle.code, name: bundle.name, status: bundle.status, stats: bundle.stats };
}
