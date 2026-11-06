/**
 * Golden rule 4: a build ships only the content it asked for. The status
 * filter runs in npm's prebuild hook, so a bare `vite build` would bundle
 * whatever src/generated/ last held (usually the dev server's draft bundle).
 * vite.config.ts calls this and stops such a build:
 * - release: always fine
 * - draft: only with `--mode draft` (npm run build:draft)
 * - beta: only with the RELEASE_ALLOW_SPEAKER_CHECKED=1 that produced it
 * Returns the problem, or undefined when the build may go ahead.
 */
export function checkBuildChannel(
  channel: string | undefined,
  mode: string,
  allowSpeakerChecked: boolean,
): string | undefined {
  if (channel === 'release') return undefined;
  if (channel === 'draft' && mode === 'draft') return undefined;
  if (channel === 'beta' && allowSpeakerChecked) return undefined;
  return (
    `src/generated/ holds a "${channel ?? 'missing'}" content bundle, which this build didn't ask for. ` +
    'Use npm run build (verified only), npm run build:draft (labelled preview), ' +
    'or npm run build with RELEASE_ALLOW_SPEAKER_CHECKED=1 (beta).'
  );
}
