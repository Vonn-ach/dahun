import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { generateSchemaTypes, SCHEMA_TYPES_FILE } from './schema-types';

describe('src/content/schema.generated.ts', () => {
  it('matches the schemas (run `npm run gen:types` after changing a schema)', async () => {
    const committed = readFileSync(SCHEMA_TYPES_FILE, 'utf8').replace(/\r\n/g, '\n');
    expect(await generateSchemaTypes()).toBe(committed);
  }, 30_000);
});
