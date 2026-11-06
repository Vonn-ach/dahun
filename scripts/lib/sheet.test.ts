import { describe, expect, it } from 'vitest';
import { SHEET_COLUMNS, verificationSheet } from './sheet';
import { fixtureRoot } from './test-helpers';
import { validateContent } from './validate';

function sheetLines(): string[] {
  const pack = validateContent({ contentRoot: fixtureRoot('valid') }).packs[0]?.pack;
  if (!pack) throw new Error('fixture should load');
  const pack2 = structuredClone(pack);
  const first = pack2.lexicon.entries[0];
  if (first) first.note = { en: 'A note, with "quotes"' };
  const last = pack2.lexicon.entries[5];
  if (last) last.status = 'retired';
  return verificationSheet(pack2).split('\n');
}

describe('verificationSheet', () => {
  it('starts with a byte-order mark and the header', () => {
    const [header] = sheetLines();
    expect(header?.charCodeAt(0)).toBe(0xfeff);
    expect(header?.slice(1)).toBe(SHEET_COLUMNS.join(','));
  });

  it('copies forms, glosses, dialect, variants and notes, with blanks for the speaker', () => {
    const lines = sheetLines();
    expect(lines[1]).toBe(
      'tst-0001,Basics,basics-1,alfa,stone,batu,north,,"A note, with ""quotes""",,,,,,,,,',
    );
    expect(lines[3]).toBe('tst-0003,Basics,basics-1,charlie,house,rumah,south,charly,,,,,,,,,,');
    expect(lines[2]).toContain("bravo'");
  });

  it('leaves out retired entries and lists sentences after the entries', () => {
    const lines = sheetLines();
    expect(lines.some((l) => l.startsWith('tst-0006,'))).toBe(false);
    expect(lines.at(-3)).toBe(
      'tst-s001,Sentences,,Alfa delta.,A stone tree.,Pokok batu.,north,,,,,,,,,,,',
    );
    expect(lines.at(-2)?.startsWith('tst-s002,Sentences,,Golf charlie?')).toBe(true);
    expect(lines.at(-1)).toBe('');
  });
});
