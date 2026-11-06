// npm run validate:content — checks every language pack and prints a report.
// Exits with 1 when there are errors; warnings are reported but don't fail.
// It only reads content/; it never changes a file.
import path from 'node:path';
import { parseArgs } from 'node:util';
import { formatReport, reportJson } from './lib/report';
import { validateContent } from './lib/validate';

const { values } = parseArgs({
  options: {
    content: { type: 'string' },
    schemas: { type: 'string' },
    json: { type: 'boolean', default: false },
  },
});

const report = validateContent({
  ...(values.content ? { contentRoot: path.resolve(values.content) } : {}),
  ...(values.schemas ? { schemasDir: path.resolve(values.schemas) } : {}),
});

console.log(
  values.json
    ? JSON.stringify(reportJson(report), null, 2)
    : formatReport(report, { color: !!process.stdout.isTTY && !process.env['NO_COLOR'] }),
);
process.exitCode = report.errors > 0 ? 1 : 0;
