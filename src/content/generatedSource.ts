// The real content: the bundles scripts/build-content.ts wrote to src/generated/.
// Only App.tsx imports this, so tests can run on fixture bundles instead.
import { channel, languages, loaders } from '../generated';
import type { ContentSource } from './context';

export const generatedSource: ContentSource = {
  channel,
  languages,
  load(code) {
    const load = loaders[code];
    if (!load) return Promise.reject(new Error(`No content bundle for "${code}"`));
    return load();
  },
};
