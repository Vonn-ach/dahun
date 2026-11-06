/** What scripts/build-content.ts last wrote to src/generated/meta.json. */
export interface ContentMeta {
  channel?: string;
  /** The content folder the bundles came from, relative to the repo. */
  contentDir?: string;
}

/**
 * Golden rule 4: a build ships only the content it asked for. The status
 * filter runs in npm's prebuild hook, so a bare `vite build` would bundle
 * whatever src/generated/ last held (usually the dev server's draft bundle,
 * or the fixture course after `npm run e2e`). vite.config.ts calls this and
 * stops such a build:
 * - anything not built from content/ (e.g. tests/fixtures): never
 * - release: always fine
 * - draft: only with `--mode draft` (npm run build:draft)
 * - beta: only with the RELEASE_ALLOW_SPEAKER_CHECKED=1 that produced it
 * Returns the problem, or undefined when the build may go ahead.
 */
export function checkBuildChannel(
  meta: ContentMeta | undefined,
  mode: string,
  allowSpeakerChecked: boolean,
): string | undefined {
  const channel = meta?.channel;
  const fix =
    'Use npm run build (verified only), npm run build:draft (labelled preview), ' +
    'or npm run build with RELEASE_ALLOW_SPEAKER_CHECKED=1 (beta).';
  if (meta?.contentDir !== 'content') {
    return `src/generated/ was built from "${meta?.contentDir ?? 'unknown'}", not content/. ${fix}`;
  }
  if (channel === 'release') return undefined;
  if (channel === 'draft' && mode === 'draft') return undefined;
  if (channel === 'beta' && allowSpeakerChecked) return undefined;
  return `src/generated/ holds a "${channel ?? 'missing'}" content bundle, which this build didn't ask for. ${fix}`;
}
