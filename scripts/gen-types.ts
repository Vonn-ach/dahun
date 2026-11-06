// Regenerates src/content/schema.generated.ts from schemas/. Run after changing a schema.
import { writeFileSync } from 'node:fs';
import { displayPath } from './lib/paths';
import { generateSchemaTypes, SCHEMA_TYPES_FILE } from './lib/schema-types';

writeFileSync(SCHEMA_TYPES_FILE, await generateSchemaTypes());
console.log(`Wrote ${displayPath(SCHEMA_TYPES_FILE)}`);
