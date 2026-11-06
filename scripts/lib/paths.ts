import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const CONTENT_DIR = path.join(REPO_ROOT, 'content');
export const SCHEMAS_DIR = path.join(REPO_ROOT, 'schemas');
export const GENERATED_DIR = path.join(REPO_ROOT, 'src', 'generated');

/** Forward slashes, relative to the repo, for messages that read the same on Windows. */
export function displayPath(file: string): string {
  return path.relative(REPO_ROOT, file).split(path.sep).join('/');
}
