import { describe, expect, it } from 'vitest';
import type { PackFiles } from '../../src/content/schema.generated';
import { buildBundle, channelFor } from './bundle';
import { fixtureRoot } from './test-helpers';
import { validateContent } from './validate';

function validPack(): PackFiles {
  const pack = validateContent({ contentRoot: fixtureRoot('valid') }).packs[0]?.pack;
  if (!pack) throw new Error('The valid fixture pack should load');
  return pack;
}

const ids = (items: readonly { id: string }[]) => items.map((i) => i.id);

describe('channelFor', () => {
  it('picks draft, beta or release', () => {
    expect(channelFor({ includeDrafts: true, allowSpeakerChecked: true })).toBe('draft');
    expect(channelFor({ includeDrafts: false, allowSpeakerChecked: true })).toBe('beta');
    expect(channelFor({ includeDrafts: false, allowSpeakerChecked: false })).toBe('release');
  });
});

describe('buildBundle', () => {
  it('keeps only verified content in a release build and drops what is left incomplete (D012)', () => {
    const bundle = buildBundle(validPack(), 'release');
    expect(bundle.channel).toBe('release');
    expect(ids(bundle.entries)).toEqual(['tst-0001', 'tst-0002', 'tst-0003']);
    // "more-1" keeps no entries, so it and its unit are dropped.
    expect(ids(bundle.units)).toEqual(['basics']);
    expect(bundle.units[0]?.lessons.map((l) => l.id)).toEqual(['basics-1']);
    // The verified sentence stays, without its link to the speaker-checked entry.
    expect(bundle.sentences).toHaveLength(1);
    expect(bundle.sentences[0]?.uses).toEqual(['tst-0001']);
    // uiPhrases pointing at excluded entries are removed, so the UI falls back to i18n.
    expect(bundle.uiPhrases).toEqual({ praise: 'tst-0001' });
    expect(bundle.stats).toEqual({
      totalEntries: 6,
      verifiedEntries: 3,
      includedEntries: 3,
      totalLessons: 2,
      includedLessons: 1,
    });
  });

  it('adds speaker-checked entries in a beta build, but drops lessons under 3 entries', () => {
    const bundle = buildBundle(validPack(), 'beta');
    expect(ids(bundle.entries)).toEqual(['tst-0001', 'tst-0002', 'tst-0003', 'tst-0004']);
    expect(bundle.sentences[0]?.uses).toEqual(['tst-0001', 'tst-0004']);
    expect(ids(bundle.units)).toEqual(['basics']);
  });

  it('includes drafts in a draft build', () => {
    const bundle = buildBundle(validPack(), 'draft');
    expect(bundle.entries).toHaveLength(6);
    expect(ids(bundle.units)).toEqual(['basics', 'more']);
    expect(bundle.units[1]?.taglineEntries).toEqual(['tst-0005']);
    expect(bundle.uiPhrases).toEqual({ praise: 'tst-0001', greeting: 'tst-0005' });
  });

  it('never includes retired entries, not even in a draft build', () => {
    const pack = validPack();
    const entry = pack.lexicon.entries[5];
    if (entry) entry.status = 'retired';
    const bundle = buildBundle(pack, 'draft');
    expect(ids(bundle.entries)).not.toContain('tst-0006');
    expect(bundle.stats.totalEntries).toBe(5);
    // "more-1" is left with 2 entries, under the minimum of 3.
    expect(ids(bundle.units)).toEqual(['basics']);
  });

  it('leaves out speaker reviews and internal source notes', () => {
    const bundle = buildBundle(validPack(), 'draft');
    const text = JSON.stringify(bundle);
    expect(text).not.toContain('"review"');
    expect(text).not.toContain('Internal note');
    expect(text).not.toContain('licence');
    expect(bundle.sources['test-list']).toEqual({
      title: 'Test word list',
      author: 'Fixture Author',
      year: 2026,
      url: 'https://example.org/list',
    });
  });

  it('keeps forms exactly as written', () => {
    const pack = validPack();
    const bundle = buildBundle(pack, 'draft');
    expect(bundle.entries.map((e) => e.form)).toEqual(pack.lexicon.entries.map((e) => e.form));
    expect(bundle.entries[2]?.variants).toEqual([{ form: 'charly', dialect: 'north' }]);
    expect(bundle.entries[0]?.audio?.[0]?.file).toBe('tst-0001__SPK01.m4a');
  });

  it('fills in selectable for every dialect', () => {
    const bundle = buildBundle(validPack(), 'release');
    expect(bundle.dialects.map((d) => [d.id, d.selectable])).toEqual([
      ['north', true],
      ['south', true],
      ['shared', false],
    ]);
  });
});
