import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { Ajv2020, type ErrorObject, type ValidateFunction } from 'ajv/dist/2020.js';
import addFormatsModule from 'ajv-formats';
import { PACK_FILES, type PackFileKey } from './pack';

// ajv-formats is CommonJS; depending on how it's loaded the plugin is the
// module itself or its default export.
const addFormats = ((addFormatsModule as unknown as { default?: unknown }).default ??
  addFormatsModule) as (ajv: Ajv2020) => Ajv2020;

const SCHEMA_FOR: Record<PackFileKey, string> = {
  language: 'language.schema.json',
  lexicon: 'lexicon.schema.json',
  sentences: 'sentences.schema.json',
  course: 'course.schema.json',
  legacyIdMap: 'legacy-id-map.schema.json',
};

export type SchemaValidators = Record<PackFileKey, ValidateFunction>;

/** Compiles every schema once: the 2020-12 dialect, all errors, real format checks (D013). */
export function createSchemaValidators(schemasDir: string): SchemaValidators {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);

  const ids = new Map<string, string>();
  for (const file of readdirSync(schemasDir).filter((f) => f.endsWith('.schema.json'))) {
    const schema = JSON.parse(readFileSync(path.join(schemasDir, file), 'utf8')) as {
      $id?: string;
    };
    if (!schema.$id) throw new Error(`${file} has no $id`);
    ajv.addSchema(schema);
    ids.set(file, schema.$id);
  }

  const validators = {} as SchemaValidators;
  for (const key of Object.keys(PACK_FILES) as PackFileKey[]) {
    const id = ids.get(SCHEMA_FOR[key]);
    const validate = id ? ajv.getSchema(id) : undefined;
    if (!validate) throw new Error(`Schema ${SCHEMA_FOR[key]} not found in ${schemasDir}`);
    validators[key] = validate;
  }
  return validators;
}

/**
 * "/entries/12/gloss" → "entries[tst-0013].gloss", so a message points at the
 * entry a person would search for rather than an array position.
 */
export function describeLocation(data: unknown, instancePath: string): string {
  const parts = instancePath
    .split('/')
    .slice(1)
    .map((p) => p.replace(/~1/g, '/').replace(/~0/g, '~'));
  let node: unknown = data;
  let out = '';
  for (const part of parts) {
    if (Array.isArray(node)) {
      const item: unknown = node[Number(part)];
      const id =
        item && typeof item === 'object' && typeof (item as { id?: unknown }).id === 'string'
          ? (item as { id: string }).id
          : undefined;
      out += `[${id ?? part}]`;
      node = item;
    } else {
      out += out ? `.${part}` : part;
      node = node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined;
    }
  }
  return out || '(top level)';
}

function valueAt(data: unknown, instancePath: string): unknown {
  let node: unknown = data;
  for (const part of instancePath.split('/').slice(1)) {
    if (!node || typeof node !== 'object') return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return node;
}

/** One readable line per Ajv error. */
export function describeSchemaError(error: ErrorObject, data: unknown): string {
  const where = describeLocation(data, error.instancePath);
  const params = error.params as Record<string, unknown>;
  switch (error.keyword) {
    case 'additionalProperties':
      return `${where}: unknown field "${String(params['additionalProperty'])}"`;
    case 'required':
      return `${where}: missing required field "${String(params['missingProperty'])}"`;
    case 'enum':
      return `${where}: must be one of ${(params['allowedValues'] as unknown[]).map((v) => JSON.stringify(v)).join(', ')}`;
    case 'pattern':
    case 'format':
      return `${where}: ${JSON.stringify(valueAt(data, error.instancePath))} ${error.message ?? 'is not valid'}`;
    default:
      return `${where}: ${error.message ?? 'is not valid'}`;
  }
}
