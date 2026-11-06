import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { IssueList } from './issues';

/** The files a language pack may contain, keyed as in PackFiles. */
export const PACK_FILES = {
  language: 'language.json',
  lexicon: 'lexicon.json',
  sentences: 'sentences.json',
  course: 'course.json',
  legacyIdMap: 'legacy-id-map.json',
} as const;

export type PackFileKey = keyof typeof PACK_FILES;

export const REQUIRED_FILES: readonly PackFileKey[] = [
  'language',
  'lexicon',
  'sentences',
  'course',
];

export const AUDIO_DIR = 'audio';

export interface RawPack {
  /** The folder name, which must equal language.json → code. */
  folder: string;
  dir: string;
  /** Parsed JSON, not yet checked against the schemas. */
  raw: Partial<Record<PackFileKey, unknown>>;
  /** File names inside audio/, without hidden files such as .gitkeep. */
  audioFiles: string[];
  issues: IssueList;
}

/** Every folder under <contentRoot>/languages/, sorted by name. */
export function discoverPacks(contentRoot: string): string[] {
  const languagesDir = path.join(contentRoot, 'languages');
  if (!existsSync(languagesDir)) return [];
  return readdirSync(languagesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => path.join(languagesDir, d.name))
    .sort();
}

function readJson(file: string): { ok: true; data: unknown } | { ok: false; message: string } {
  try {
    // A BOM sneaks in when Windows editors save JSON; it isn't part of the data.
    const raw = readFileSync(file, 'utf8');
    const text = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
    return { ok: true, data: JSON.parse(text) as unknown };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Reads one pack folder. Only the top level is read for JSON: audio/ is listed
 * for the audio check, and proposals/ (speaker corrections waiting for the
 * owner) is skipped, as are other folders and non-JSON files such as README.md.
 * Nothing here writes to the content folder.
 */
export function readPack(dir: string): RawPack {
  const issues = new IssueList();
  const raw: RawPack['raw'] = {};
  const known = new Set<string>(Object.values(PACK_FILES));

  for (const [key, file] of Object.entries(PACK_FILES) as [PackFileKey, string][]) {
    const full = path.join(dir, file);
    if (!existsSync(full)) {
      if (REQUIRED_FILES.includes(key)) {
        issues.error(file, 'missing-file', `${file} is missing. Every language pack needs it.`);
      }
      continue;
    }
    const result = readJson(full);
    if (result.ok) raw[key] = result.data;
    else issues.error(file, 'invalid-json', `This isn't valid JSON: ${result.message}`);
  }

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.json') && !known.has(entry.name)) {
      issues.warn(
        entry.name,
        'unknown-file',
        'No schema covers this file, so the app ignores it. Check the name for typos.',
      );
    }
  }

  const audioDir = path.join(dir, AUDIO_DIR);
  const audioFiles = existsSync(audioDir)
    ? readdirSync(audioDir, { withFileTypes: true })
        .filter((d) => d.isFile() && !d.name.startsWith('.'))
        .map((d) => d.name)
        .sort()
    : [];

  return { folder: path.basename(dir), dir, raw, audioFiles, issues };
}
