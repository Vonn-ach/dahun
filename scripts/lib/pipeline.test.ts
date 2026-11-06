import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Bundle } from '../../src/content/types';
import { buildBundle } from './bundle';
import { emitBundles, indexSource } from './emit';
import { CONTENT_DIR, REPO_ROOT } from './paths';
import { fixtureRoot } from './test-helpers';
import { validateContent } from './validate';

let tmp: string;
beforeEach(() => {
  tmp = mkdtempSync(path.join(tmpdir(), 'dahun-pipeline-'));
});
afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

function runScript(script: string, args: string[]) {
  return spawnSync(process.execPath, ['--import', 'tsx', path.join('scripts', script), ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1' },
  });
}

describe('emitBundles', () => {
  it('writes a minified bundle per language, an index and meta.json, and removes stale bundles', () => {
    writeFileSync(path.join(tmp, 'old.bundle.json'), '{}');
    writeFileSync(path.join(tmp, 'notes.txt'), 'not ours');
    const pack = validateContent({ contentRoot: fixtureRoot('valid') }).packs[0]?.pack;
    if (!pack) throw new Error('fixture should load');

    emitBundles([buildBundle(pack, 'release')], 'release', tmp);

    expect(readdirSync(tmp).sort()).toEqual([
      'index.ts',
      'meta.json',
      'notes.txt',
      'tst.bundle.json',
    ]);
    const text = readFileSync(path.join(tmp, 'tst.bundle.json'), 'utf8');
    expect(text).not.toContain('\n');
    expect((JSON.parse(text) as Bundle).channel).toBe('release');
    expect(JSON.parse(readFileSync(path.join(tmp, 'meta.json'), 'utf8'))).toEqual({
      channel: 'release',
    });
  });

  it('writes an index with the language list and one lazy loader per language', () => {
    const source = indexSource(
      [
        { code: 'aaa', name: { en: 'A', ms: 'A' }, status: 'draft', stats: emptyStats },
        { code: 'bbb', name: { en: 'B', ms: 'B' }, status: 'live', stats: emptyStats },
      ],
      'draft',
    );
    expect(source).toContain('export const channel: Channel = "draft";');
    expect(source).toContain(`"aaa": () =>\n    import('./aaa.bundle.json')`);
    expect(source).toContain(`"bbb": () =>\n    import('./bbb.bundle.json')`);
  });
});

const emptyStats = {
  totalEntries: 0,
  verifiedEntries: 0,
  includedEntries: 0,
  totalLessons: 0,
  includedLessons: 0,
};

describe('adding a language folder', () => {
  it('makes a second language appear with no code changes', () => {
    // Copy the fixture pack twice into a temp content folder: once as it is,
    // and once as a pretend language "zzz" with new ids and a new name.
    const languages = path.join(tmp, 'content', 'languages');
    const tst = path.join(fixtureRoot('valid'), 'languages', 'tst');
    cpSync(tst, path.join(languages, 'tst'), { recursive: true });
    const zzz = path.join(languages, 'zzz');
    mkdirSync(path.join(zzz, 'audio'), { recursive: true });
    for (const file of readdirSync(tst).filter((f) => f.endsWith('.json'))) {
      // Ids and audio file names start with "tst-"; the placeholder forms never do.
      const text = readFileSync(path.join(tst, file), 'utf8')
        .replace(/tst-/g, 'zzz-')
        .replace(/"tst"/g, '"zzz"');
      writeFileSync(path.join(zzz, file), text);
    }
    for (const file of readdirSync(path.join(tst, 'audio'))) {
      cpSync(path.join(tst, 'audio', file), path.join(zzz, 'audio', file.replace(/^tst-/, 'zzz-')));
    }
    const languageFile = path.join(zzz, 'language.json');
    const language = JSON.parse(readFileSync(languageFile, 'utf8')) as {
      name: Record<string, string>;
    };
    language.name = { en: 'Zedish (test copy)', ms: 'Bahasa Zed (salinan ujian)' };
    writeFileSync(languageFile, JSON.stringify(language));

    const report = validateContent({ contentRoot: path.join(tmp, 'content') });
    expect(report.errors).toBe(0);
    expect(report.packs.map((p) => p.folder)).toEqual(['tst', 'zzz']);

    const bundles = report.packs.map((p) => buildBundle(p.pack!, 'draft'));
    const out = path.join(tmp, 'generated');
    emitBundles(bundles, 'draft', out);

    const index = readFileSync(path.join(out, 'index.ts'), 'utf8');
    expect(index).toContain('"code":"tst"');
    expect(index).toContain('"code":"zzz"');
    expect(index).toContain('Zedish (test copy)');
    expect(index).toContain(`import('./zzz.bundle.json')`);
    const tstBundle = JSON.parse(readFileSync(path.join(out, 'tst.bundle.json'), 'utf8')) as Bundle;
    const zzzBundle = JSON.parse(readFileSync(path.join(out, 'zzz.bundle.json'), 'utf8')) as Bundle;
    expect(zzzBundle.entries).toHaveLength(tstBundle.entries.length);
    expect(zzzBundle.entries.map((e) => e.form)).toEqual(tstBundle.entries.map((e) => e.form));
  });

  it('validates the real content folder', () => {
    // Whatever is in content/languages/ today must pass, even an empty new pack.
    expect(validateContent({ contentRoot: CONTENT_DIR }).errors).toBe(0);
  });
});

describe('command line', () => {
  it('validate:content exits with 0 on a clean pack and 1 on errors', () => {
    const ok = runScript('validate-content.ts', ['--content', fixtureRoot('valid')]);
    expect(ok.status, ok.stderr).toBe(0);
    expect(ok.stdout).toContain('0 errors, 0 warnings in 1 language pack.');

    const broken = runScript('validate-content.ts', ['--content', fixtureRoot('broken-refs')]);
    expect(broken.status).toBe(1);
    expect(broken.stdout).toContain('8 errors');
  }, 30_000);

  it('build-content refuses to build when there are errors, and writes nothing', () => {
    const out = path.join(tmp, 'generated');
    const result = runScript('build-content.ts', [
      '--content',
      fixtureRoot('duplicate-ids'),
      '--out',
      out,
    ]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('The content bundle was not built.');
    expect(existsSync(out)).toBe(false);
  }, 30_000);

  it('build-content uses the beta channel when RELEASE_ALLOW_SPEAKER_CHECKED=1', () => {
    const out = path.join(tmp, 'generated');
    const result = spawnSync(
      process.execPath,
      [
        '--import',
        'tsx',
        'scripts/build-content.ts',
        '--content',
        fixtureRoot('valid'),
        '--out',
        out,
      ],
      {
        cwd: REPO_ROOT,
        encoding: 'utf8',
        env: { ...process.env, RELEASE_ALLOW_SPEAKER_CHECKED: '1' },
      },
    );
    expect(result.status, result.stderr).toBe(0);
    const bundle = JSON.parse(readFileSync(path.join(out, 'tst.bundle.json'), 'utf8')) as Bundle;
    expect(bundle.channel).toBe('beta');
    expect(bundle.entries).toHaveLength(4);
  }, 30_000);
});
