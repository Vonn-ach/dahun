// Turns content/languages/* into the bundles the app loads (src/generated/).
//   default           release: verified entries only
//   RELEASE_ALLOW_SPEAKER_CHECKED=1   beta: verified + speaker-checked (D008)
//   --include-drafts  draft: everything except retired (dev server, labelled preview)
// It validates first and stops on errors. It never writes to content/.
import path from 'node:path';
import { parseArgs } from 'node:util';
import { buildBundle, channelFor } from './lib/bundle';
import { emitBundles } from './lib/emit';
import { displayPath, GENERATED_DIR } from './lib/paths';
import { formatReport } from './lib/report';
import { validateContent } from './lib/validate';

const { values } = parseArgs({
  options: {
    'include-drafts': { type: 'boolean', default: false },
    content: { type: 'string' },
    schemas: { type: 'string' },
    out: { type: 'string' },
    quiet: { type: 'boolean', default: false },
  },
});

const color = !!process.stdout.isTTY && !process.env['NO_COLOR'];
const report = validateContent({
  ...(values.content ? { contentRoot: path.resolve(values.content) } : {}),
  ...(values.schemas ? { schemasDir: path.resolve(values.schemas) } : {}),
});

if (report.errors > 0) {
  console.error(formatReport(report, { color }));
  console.error('\nThe content bundle was not built. Fix the errors above first.');
  process.exit(1);
}

const channel = channelFor({
  includeDrafts: values['include-drafts'],
  allowSpeakerChecked: process.env['RELEASE_ALLOW_SPEAKER_CHECKED'] === '1',
});
const bundles = report.packs.flatMap((p) => (p.pack ? [buildBundle(p.pack, channel)] : []));
const outDir = values.out ? path.resolve(values.out) : GENERATED_DIR;
const { files } = emitBundles(bundles, channel, outDir);

if (!values.quiet) {
  console.log(`Content bundles (${channel}) → ${displayPath(outDir)}/`);
  for (const b of bundles) {
    const s = b.stats;
    const size = files.find((f) => f.path.endsWith(`${b.code}.bundle.json`))?.bytes ?? 0;
    console.log(
      `  ${b.code}: ${s.includedEntries} of ${s.totalEntries} entries, ` +
        `${s.includedLessons} of ${s.totalLessons} lessons, ${b.units.length} units ` +
        `(${(size / 1024).toFixed(1)} KB)`,
    );
    if (s.includedLessons === 0) {
      console.log(`    No lessons in this build yet: ${s.verifiedEntries} entries are verified.`);
    }
  }
  if (report.warnings > 0) {
    console.log(`  ${report.warnings} content warnings. See npm run validate:content.`);
  }
}
