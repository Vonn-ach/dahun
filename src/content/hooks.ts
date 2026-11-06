import { use, useContext } from 'react';
import { ContentContext, type ContentStore } from './context';
import type { Course } from './course';
import type { Channel, LanguageSummary } from './types';

function useStore(): ContentStore {
  const store = useContext(ContentContext);
  if (!store) throw new Error('Content hooks must be used inside <ContentProvider>.');
  return store;
}

/** Every course in this build, available before any bundle loads. */
export function useLanguages(): readonly LanguageSummary[] {
  return useStore().source.languages;
}

/** release, beta or draft: which statuses this build includes. */
export function useContentChannel(): Channel {
  return useStore().source.channel;
}

/**
 * The course the learner is studying. Until the course picker (prompt 14) and
 * saved settings (prompt 05) exist, that is the first language in the build.
 */
export function useCurrentLanguage(): LanguageSummary | undefined {
  return useLanguages()[0];
}

/** Loads a course by language code. Suspends until its bundle has loaded. */
export function useCourse(code: string): Course {
  return use(useStore().course(code));
}

/** The current course, or undefined when the build has no language packs at all. */
export function useCurrentCourse(): Course | undefined {
  const store = useStore();
  const language = useCurrentLanguage();
  return language ? use(store.course(language.code)) : undefined;
}
