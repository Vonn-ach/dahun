import { createContext } from 'react';
import { createCourse, type Course } from './course';
import type { Bundle, Channel, LanguageSummary } from './types';

/** Where courses come from: the generated bundles in the app, fixtures in tests. */
export interface ContentSource {
  channel: Channel;
  languages: readonly LanguageSummary[];
  /** A bundle, or a promise of one (the generated loaders are lazy imports). */
  load(code: string): Bundle | Promise<Bundle>;
}

export interface ContentStore {
  source: ContentSource;
  /** The same promise for the same code every time, as React's use() requires. */
  course(code: string): Promise<Course>;
}

type Tracked<T> = Promise<T> & { status?: 'fulfilled'; value?: T };

/**
 * A promise React's use() can read without suspending: it checks these two
 * fields before waiting. Used when a bundle is already in memory.
 */
function fulfilled<T>(value: T): Promise<T> {
  const promise: Tracked<T> = Promise.resolve(value);
  promise.status = 'fulfilled';
  promise.value = value;
  return promise;
}

export function createContentStore(source: ContentSource): ContentStore {
  const cache = new Map<string, Promise<Course>>();
  return {
    source,
    course(code) {
      const cached = cache.get(code);
      if (cached) return cached;
      const loaded = source.load(code);
      const course =
        loaded instanceof Promise ? loaded.then(createCourse) : fulfilled(createCourse(loaded));
      // A failed chunk (offline before the PWA lands) shouldn't stick: let a re-render retry.
      course.catch(() => cache.delete(code));
      cache.set(code, course);
      return course;
    },
  };
}

export const ContentContext = createContext<ContentStore | null>(null);
