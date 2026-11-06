import type { PackFiles } from '../../src/content/schema.generated';

/** Filled from the content files. */
const FROM_CONTENT = [
  'id',
  'unit',
  'lesson',
  'form_in_draft',
  'english',
  'malay',
  'dialect_in_draft',
  'other_spellings',
  'note_in_draft',
  'constructed',
] as const;

/** Left empty for the speaker session. */
const FOR_SPEAKERS = [
  'correct_Y_N_unsure',
  'corrected_form',
  'speaker_dialect_or_village',
  'usage_note',
  'audio_recorded_Y_N',
  'audio_file',
  'speaker_code',
  'date',
] as const;

export const SHEET_COLUMNS = [...FROM_CONTENT, ...FOR_SPEAKERS];

const SENTENCES_UNIT = 'Sentences';
const BOM = String.fromCharCode(0xfeff);

function csvField(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/**
 * The speaker verification sheet for one pack (D013): every entry that isn't
 * retired, then every sentence, with the forms copied exactly as they are in
 * the content. Starts with a byte-order mark so Excel reads é and ' correctly.
 */
export function verificationSheet(pack: PackFiles): string {
  const lessonOf = new Map<string, { unit: string; lesson: string }>();
  for (const unit of pack.course.units) {
    for (const lesson of unit.lessons) {
      for (const id of lesson.introduce) {
        if (!lessonOf.has(id)) lessonOf.set(id, { unit: unit.title.en, lesson: lesson.id });
      }
    }
  }

  const blanks = FOR_SPEAKERS.map(() => '');
  const rows: string[][] = [SHEET_COLUMNS];
  for (const e of pack.lexicon.entries) {
    if (e.status === 'retired') continue;
    const where = lessonOf.get(e.id);
    rows.push([
      e.id,
      where?.unit ?? '',
      where?.lesson ?? '',
      e.form,
      e.gloss.en,
      e.gloss.ms,
      e.dialect,
      (e.variants ?? []).map((v) => v.form).join('; '),
      e.note?.en ?? '',
      e.constructed ? 'yes' : '',
      ...blanks,
    ]);
  }
  for (const s of pack.sentences.entries) {
    if (s.status === 'retired') continue;
    rows.push([
      s.id,
      SENTENCES_UNIT,
      '',
      s.text,
      s.gloss.en,
      s.gloss.ms,
      s.dialect,
      '',
      '',
      s.constructed ? 'yes' : '',
      ...blanks,
    ]);
  }
  return `${BOM}${rows.map((row) => row.map(csvField).join(',')).join('\n')}\n`;
}
