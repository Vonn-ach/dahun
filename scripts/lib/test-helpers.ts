import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { REPO_ROOT } from './paths';
import type { Issue, IssueCode } from './issues';
import type { ContentReport } from './validate';

export const FIXTURES = path.join(REPO_ROOT, 'tests', 'fixtures', 'packs');

/** A content root holding the named fixture packs. */
export function fixtureRoot(name: string): string {
  return path.join(FIXTURES, name);
}

/** Copies a fixture content root into a temp folder so a test can change it. */
export function copyFixture(name: string): { root: string; pack: string; cleanup: () => void } {
  const root = mkdtempSync(path.join(tmpdir(), 'dahun-content-'));
  cpSync(fixtureRoot(name), root, { recursive: true });
  return {
    root,
    pack: path.join(root, 'languages', 'tst'),
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
}

/** Reads a JSON file, lets the test change it, and writes it back. */
export function editJson<T = Record<string, unknown>>(
  file: string,
  change: (data: T) => void,
): void {
  const data = JSON.parse(readFileSync(file, 'utf8')) as T;
  change(data);
  writeFileSync(file, JSON.stringify(data, null, 2));
}

export function allIssues(report: ContentReport): Issue[] {
  return [...report.issues, ...report.packs.flatMap((p) => p.issues)];
}

export function codes(report: ContentReport, severity?: Issue['severity']): IssueCode[] {
  return allIssues(report)
    .filter((i) => !severity || i.severity === severity)
    .map((i) => i.code);
}

export function find(report: ContentReport, code: IssueCode): Issue[] {
  return allIssues(report).filter((i) => i.code === code);
}
