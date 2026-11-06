import { styleText } from 'node:util';
import { displayPath } from './paths';
import type { Issue } from './issues';
import { PACK_FILES } from './pack';
import type { ContentReport, PackReport } from './validate';

export interface FormatOptions {
  color?: boolean;
}

const MAX_IDS = 12;
const FILE_ORDER: string[] = [...Object.values(PACK_FILES), 'audio/', '(pack)'];

type Style = Parameters<typeof styleText>[0];

function painter(color: boolean) {
  return (style: Style, text: string) =>
    color ? styleText(style, text, { validateStream: false }) : text;
}

function listIds(ids: readonly string[] | undefined): string {
  if (!ids?.length) return '';
  const shown = ids.slice(0, MAX_IDS).join(', ');
  return ids.length > MAX_IDS ? `${shown} and ${ids.length - MAX_IDS} more` : shown;
}

function packHeading(pack: PackReport): string {
  const name = pack.name ? ` · ${pack.name}` : '';
  if (!pack.stats) return `${pack.folder}${name}`;
  const s = pack.stats;
  const statuses = Object.entries(s.byStatus)
    .filter(([, n]) => n > 0)
    .map(([status, n]) => `${n} ${status}`)
    .join(', ');
  return (
    `${pack.folder}${name}\n` +
    `  ${s.entries} entries (${statuses || 'none'}) · ${s.sentences} sentences · ` +
    `${s.units} units · ${s.lessons} lessons · ${s.entriesWithAudio} with audio`
  );
}

function formatIssues(
  issues: readonly Issue[],
  paint: ReturnType<typeof painter>,
  indent: string,
): string[] {
  const lines: string[] = [];
  const byFile = new Map<string, Issue[]>();
  for (const issue of issues) byFile.set(issue.file, [...(byFile.get(issue.file) ?? []), issue]);
  const files = [...byFile.keys()].sort((a, b) => {
    const ia = FILE_ORDER.indexOf(a);
    const ib = FILE_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
  });
  for (const file of files) {
    lines.push('', `${indent}${paint('bold', file)}`);
    const list = (byFile.get(file) ?? []).sort((a, b) =>
      a.severity === b.severity ? 0 : a.severity === 'error' ? -1 : 1,
    );
    for (const issue of list) {
      const label =
        issue.severity === 'error' ? paint(['red', 'bold'], 'ERROR') : paint('yellow', 'warn ');
      lines.push(`${indent}  ${label} ${paint('dim', `[${issue.code}]`)} ${issue.message}`);
      const ids = listIds(issue.ids);
      if (ids) lines.push(`${indent}        ${paint('cyan', ids)}`);
    }
  }
  return lines;
}

/** The human-readable report: one block per language pack, grouped by file. */
export function formatReport(report: ContentReport, { color = false }: FormatOptions = {}): string {
  const paint = painter(color);
  const lines: string[] = [paint('bold', 'Content check'), ''];

  lines.push(...formatIssues(report.issues, paint, ''));
  for (const pack of report.packs) {
    lines.push(paint('bold', packHeading(pack)), `  ${paint('dim', displayPath(pack.dir))}`);
    if (pack.issues.length === 0) lines.push('', `  ${paint('green', 'No problems found.')}`);
    else lines.push(...formatIssues(pack.issues, paint, '  '));
    lines.push('');
  }

  const packs = `${report.packs.length} language pack${report.packs.length === 1 ? '' : 's'}`;
  const summary = `${report.errors} error${report.errors === 1 ? '' : 's'}, ${report.warnings} warning${report.warnings === 1 ? '' : 's'} in ${packs}.`;
  lines.push(report.errors > 0 ? paint(['red', 'bold'], summary) : paint('green', summary));
  if (report.warnings > 0) lines.push(paint('dim', "Warnings don't fail the check. Errors do."));
  return lines.join('\n');
}

/** The same report as plain data, for --json, without the pack contents. */
export function reportJson(report: ContentReport): unknown {
  return {
    errors: report.errors,
    warnings: report.warnings,
    issues: report.issues,
    packs: report.packs.map(({ folder, name, stats, issues }) => ({ folder, name, stats, issues })),
  };
}
