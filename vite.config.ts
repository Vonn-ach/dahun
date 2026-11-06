/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { checkBuildChannel } from './scripts/lib/build-guard';

/** The channel scripts/build-content.ts last built: release, beta or draft. */
function contentChannel(): string | undefined {
  try {
    const meta = JSON.parse(
      readFileSync(new URL('./src/generated/meta.json', import.meta.url), 'utf8'),
    ) as { channel?: string };
    return meta.channel;
  } catch {
    return undefined;
  }
}

/**
 * Search engines must never index a build with unverified content (D007).
 * Anything that isn't known to be a release build gets noindex, so a missing
 * or odd meta.json errs on the safe side. Hosting adds X-Robots-Tag (prompt 09).
 */
const noindexUnlessRelease: Plugin = {
  name: 'dahun:noindex-unless-release',
  transformIndexHtml() {
    if (contentChannel() === 'release') return;
    return [
      { tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' }, injectTo: 'head' },
    ];
  },
};

const config: UserConfig = {
  plugins: [react(), noindexUnlessRelease],
  server: {
    // Fixed port so Playwright and the docs can rely on it.
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'app',
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
          css: {
            // Vitest blanks CSS by default; tokens.test.ts needs the real file.
            include: [/tokens\.css/],
            // Keep CSS-module class names readable so tests can assert on them.
            modules: { classNameStrategy: 'non-scoped' },
          },
        },
      },
      {
        // The content scripts run in Node, so their tests do too.
        extends: true,
        test: {
          name: 'scripts',
          environment: 'node',
          include: ['scripts/**/*.test.ts'],
        },
      },
    ],
  },
};

export default defineConfig(({ command, mode, isPreview }) => {
  // A bare `vite build` must not ship a draft or beta bundle by accident (golden rule 4).
  if (command === 'build' && !isPreview) {
    const problem = checkBuildChannel(
      contentChannel(),
      mode,
      process.env['RELEASE_ALLOW_SPEAKER_CHECKED'] === '1',
    );
    if (problem) throw new Error(problem);
  }
  return config;
});
