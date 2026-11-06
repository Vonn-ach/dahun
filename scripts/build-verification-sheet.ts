// npm run sheet — writes the speaker verification sheet from the content files (D013),
// so it never drifts from the lexicon. It reads content/ and writes only the sheet.
//   --lang <code>  which pack (optional when there is only one)
//   --out <file>   where to write (default speaker-kit/verification-sheet.csv)
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { displayPath, REPO_ROOT } from './lib/paths';
import { formatReport } from './lib/report';
import { verificationSheet } from './lib/sheet';
import { validateContent } from './lib/validate';

const { values } = parseArgs({
  options: {
    lang: { type: 'string' },
    out: { type: 'string' },
    content: { type: 'string' },
  },
});

const report = validateContent(values.content ? { contentRoot: path.resolve(values.content) } : {});
if (report.errors > 0) {
  console.error(formatReport(report));
  console.error('\nThe sheet was not written. Fix the errors above first.');
  process.exit(1);
}

const packs = report.packs.filter((p) => !values.lang || p.folder === values.lang);
const pack = packs.length === 1 ? packs[0]?.pack : undefined;
if (!pack) {
  const codes = report.packs.map((p) => p.folder).join(', ');
  console.error(`Choose one language pack with --lang (found: ${codes || 'none'}).`);
  process.exit(1);
}

const out = path.resolve(
  values.out ?? path.join(REPO_ROOT, 'speaker-kit', 'verification-sheet.csv'),
);
writeFileSync(out, verificationSheet(pack));
console.log(
  `Wrote ${displayPath(out)} (${pack.lexicon.entries.length} entries, ${pack.sentences.entries.length} sentences)`,
);
