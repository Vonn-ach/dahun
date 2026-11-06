import type {
  Bundle,
  BundleDialect,
  BundleEntry,
  BundleLesson,
  BundleSentence,
  BundleSource,
  BundleUnit,
} from './types';

/** A loaded course with lookups by id. Everything in it has passed the status filter. */
export interface Course {
  readonly code: string;
  readonly bundle: Bundle;
  readonly entries: readonly BundleEntry[];
  readonly units: readonly BundleUnit[];
  /** False while no lesson has enough checked words, e.g. a release build before verification. */
  readonly hasLessons: boolean;
  getEntry(id: string): BundleEntry | undefined;
  getSentence(id: string): BundleSentence | undefined;
  getUnit(id: string): BundleUnit | undefined;
  getLesson(id: string): BundleLesson | undefined;
  /** The unit whose lesson introduces this entry. */
  unitOfEntry(id: string): BundleUnit | undefined;
  getDialect(id: string): BundleDialect | undefined;
  getSource(key: string): BundleSource | undefined;
}

function byId<T extends { id: string }>(items: readonly T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

export function createCourse(bundle: Bundle): Course {
  const entries = byId(bundle.entries);
  const sentences = byId(bundle.sentences);
  const units = byId(bundle.units);
  const dialects = byId(bundle.dialects);
  const lessons = new Map<string, BundleLesson>();
  const unitOf = new Map<string, BundleUnit>();
  for (const unit of bundle.units) {
    for (const lesson of unit.lessons) {
      lessons.set(lesson.id, lesson);
      for (const id of lesson.introduce) unitOf.set(id, unit);
    }
  }

  return {
    code: bundle.code,
    bundle,
    entries: bundle.entries,
    units: bundle.units,
    hasLessons: lessons.size > 0,
    getEntry: (id) => entries.get(id),
    getSentence: (id) => sentences.get(id),
    getUnit: (id) => units.get(id),
    getLesson: (id) => lessons.get(id),
    unitOfEntry: (id) => unitOf.get(id),
    getDialect: (id) => dialects.get(id),
    getSource: (key) => bundle.sources[key],
  };
}
