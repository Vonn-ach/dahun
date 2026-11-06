import { readFileSync } from 'node:fs';
import path from 'node:path';
import { compile, type JSONSchema } from 'json-schema-to-typescript';
import prettier from 'prettier';
import { REPO_ROOT, SCHEMAS_DIR } from './paths';

export const SCHEMA_TYPES_FILE = path.join(REPO_ROOT, 'src', 'content', 'schema.generated.ts');

type Json = Record<string, unknown>;

const FILE_SCHEMAS = {
  common: 'common.schema.json',
  language: 'language.schema.json',
  lexicon: 'lexicon.schema.json',
  sentences: 'sentences.schema.json',
  course: 'course.schema.json',
  legacyIdMap: 'legacy-id-map.schema.json',
} as const;

// The schemas leave most nested objects untitled, which would give them
// anonymous inline types. Titles name them so the app can import them.
const TITLES: Record<keyof typeof FILE_SCHEMAS, Record<string, string>> = {
  common: { '$defs/status': 'Status' },
  language: {
    '': 'LanguageFile',
    'properties/name': 'LanguageName',
    'properties/dialects/items': 'Dialect',
    'properties/orthography': 'Orthography',
    'properties/orthography/properties/normalization': 'Normalization',
    'properties/credits': 'Credits',
    'properties/credits/properties/speakers/items': 'SpeakerCredit',
  },
  lexicon: {
    '': 'LexiconFile',
    'properties/sources/additionalProperties': 'Source',
    'properties/entries/items': 'LexiconEntry',
    'properties/entries/items/properties/variants/items': 'Variant',
  },
  sentences: { '': 'SentencesFile', 'properties/entries/items': 'Sentence' },
  course: {
    '': 'CourseFile',
    'properties/units/items': 'Unit',
    'properties/units/items/properties/lessons/items': 'Lesson',
  },
  legacyIdMap: { '': 'LegacyIdMapFile' },
};

const BANNER = `/* Generated from schemas/ by scripts/gen-types.ts. Do not edit by hand:
 * change the schema, then run \`npm run gen:types\`. A test fails if this file is stale. */`;

function readSchema(dir: string, file: string): Json {
  return JSON.parse(readFileSync(path.join(dir, file), 'utf8')) as Json;
}

function at(schema: Json, pointer: string): Json {
  let node: unknown = schema;
  for (const part of pointer ? pointer.split('/') : []) {
    node = (node as Json)[part];
    if (!node || typeof node !== 'object') throw new Error(`No schema node at ${pointer}`);
  }
  return node as Json;
}

/** Rewrites cross-file refs ("common.schema.json#/$defs/iso") to refs inside one combined schema. */
function rewriteRefs(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(rewriteRefs);
  if (!node || typeof node !== 'object') return node;
  const out: Json = {};
  for (const [key, value] of Object.entries(node as Json)) {
    if (key === '$ref' && typeof value === 'string') {
      const [file = '', fragment = ''] = value.split('#');
      const name = Object.entries(FILE_SCHEMAS).find(([, f]) => f === file)?.[0];
      if (!name) throw new Error(`Unknown schema reference ${value}`);
      out[key] = `#/$defs/${name}${fragment}`;
    } else {
      out[key] = rewriteRefs(value);
    }
  }
  return out;
}

/**
 * Builds TypeScript types for every content file from the JSON Schemas, so the
 * scripts and the app can't drift from what the validator accepts.
 */
export async function generateSchemaTypes(schemasDir = SCHEMAS_DIR): Promise<string> {
  const defs: Json = {};
  for (const [name, file] of Object.entries(FILE_SCHEMAS) as [
    keyof typeof FILE_SCHEMAS,
    string,
  ][]) {
    const schema = readSchema(schemasDir, file);
    delete schema['$id'];
    delete schema['$schema'];
    for (const [pointer, title] of Object.entries(TITLES[name]))
      at(schema, pointer)['title'] = title;
    defs[name] = rewriteRefs(schema);
  }

  const root = {
    title: 'PackFiles',
    description: 'The files of one language pack, as read from content/languages/<code>/',
    type: 'object',
    properties: {
      language: { $ref: '#/$defs/language' },
      lexicon: { $ref: '#/$defs/lexicon' },
      sentences: { $ref: '#/$defs/sentences' },
      course: { $ref: '#/$defs/course' },
      legacyIdMap: { $ref: '#/$defs/legacyIdMap' },
    },
    required: ['language', 'lexicon', 'sentences', 'course'],
    additionalProperties: false,
    $defs: defs,
  };

  const source = await compile(root as JSONSchema, 'PackFiles', {
    bannerComment: BANNER,
    additionalProperties: false,
    ignoreMinAndMaxItems: true,
    format: false,
  });

  const config = (await prettier.resolveConfig(SCHEMA_TYPES_FILE)) ?? {};
  return prettier.format(source, { ...config, filepath: SCHEMA_TYPES_FILE });
}
