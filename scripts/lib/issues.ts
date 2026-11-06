export type Severity = 'error' | 'warning';

export type IssueCode =
  // Files and schemas
  | 'no-packs'
  | 'missing-file'
  | 'invalid-json'
  | 'schema'
  | 'unknown-file'
  | 'checks-skipped'
  // References and consistency (errors)
  | 'pack-code'
  | 'language-mismatch'
  | 'id-prefix'
  | 'duplicate-id'
  | 'unknown-dialect'
  | 'default-dialect'
  | 'unknown-source'
  | 'unknown-entry'
  | 'unknown-sentence'
  | 'introduced-twice'
  | 'text-tokens'
  | 'missing-audio'
  | 'audio-name'
  | 'audio-form'
  | 'unknown-speaker'
  | 'status-unsupported'
  | 'non-ascii-apostrophe'
  // Content quality (warnings)
  | 'not-introduced'
  | 'retired-in-use'
  | 'unused-audio'
  | 'spacing'
  | 'not-nfc'
  | 'same-gloss'
  | 'overlapping-gloss'
  | 'lesson-size'
  | 'constructed'
  | 'sentence-is-phrase'
  | 'loose-collision'
  | 'ellipsis-in-form';

export interface Issue {
  severity: Severity;
  /** Pack-relative file the issue is about, e.g. "lexicon.json" or "audio/". */
  file: string;
  code: IssueCode;
  message: string;
  /** Entry or sentence ids involved, so the report can list them. */
  ids?: string[];
}

/** Collects issues for one file with short helpers, keeping the checks readable. */
export class IssueList {
  readonly items: Issue[] = [];

  error(file: string, code: IssueCode, message: string, ids?: string[]): void {
    this.items.push({ severity: 'error', file, code, message, ...(ids?.length ? { ids } : {}) });
  }

  warn(file: string, code: IssueCode, message: string, ids?: string[]): void {
    this.items.push({ severity: 'warning', file, code, message, ...(ids?.length ? { ids } : {}) });
  }
}

export function countBySeverity(issues: readonly Issue[]): { errors: number; warnings: number } {
  let errors = 0;
  for (const issue of issues) if (issue.severity === 'error') errors += 1;
  return { errors, warnings: issues.length - errors };
}
