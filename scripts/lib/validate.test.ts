import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type {
  CourseFile,
  LanguageFile,
  LexiconFile,
  SentencesFile,
} from '../../src/content/schema.generated';
import { formatReport } from './report';
import { codes, copyFixture, editJson, find, fixtureRoot } from './test-helpers';
import { glossParts, okSpeakers, validateContent } from './validate';

describe('validateContent on the fixture packs', () => {
  it('passes the valid pack with no errors or warnings', () => {
    const report = validateContent({ contentRoot: fixtureRoot('valid') });
    expect(report.packs).toHaveLength(1);
    expect(report.packs[0]?.folder).toBe('tst');
    expect(report.packs[0]?.issues).toEqual([]);
    expect(report.errors).toBe(0);
    expect(report.warnings).toBe(0);
    expect(report.packs[0]?.stats?.byStatus).toEqual({
      draft: 2,
      'speaker-checked': 1,
      verified: 3,
      retired: 0,
    });
  });

  it('reports every broken reference', () => {
    const report = validateContent({ contentRoot: fixtureRoot('broken-refs') });
    expect(report.errors).toBe(8);
    const unknown = find(report, 'unknown-entry');
    expect(unknown.map((i) => [i.file, i.ids])).toEqual(
      expect.arrayContaining([
        ['language.json', ['tst-0097']],
        ['course.json', ['tst-0099']],
        ['course.json', ['tst-0098']],
        ['sentences.json', ['tst-s002']],
        ['legacy-id-map.json', ['tst-0095']],
      ]),
    );
    expect(find(report, 'unknown-sentence')[0]?.ids).toEqual(['tst-s099']);
    expect(find(report, 'unknown-dialect')[0]?.message).toContain('"west"');
    expect(find(report, 'unknown-source')[0]?.message).toContain('"no-such-source"');
  });

  it('reports duplicate ids and an entry introduced twice', () => {
    const report = validateContent({ contentRoot: fixtureRoot('duplicate-ids') });
    expect(codes(report, 'error').sort()).toEqual([
      'duplicate-id',
      'duplicate-id',
      'introduced-twice',
    ]);
    expect(find(report, 'duplicate-id').map((i) => i.ids)).toEqual([['tst-0006'], ['tst-s002']]);
    expect(find(report, 'introduced-twice')[0]?.message).toContain('basics-1, more-1');
  });

  it('reports a missing audio file and warns about an unused one', () => {
    const report = validateContent({ contentRoot: fixtureRoot('missing-audio') });
    expect(codes(report, 'error')).toEqual(['missing-audio']);
    expect(find(report, 'missing-audio')[0]?.message).toContain('audio/tst-0002__SPK02.m4a');
    expect(find(report, 'unused-audio')[0]?.message).toContain('tst-0009__SPK01.m4a');
  });

  it('formats a report grouped by file', () => {
    const text = formatReport(validateContent({ contentRoot: fixtureRoot('broken-refs') }));
    expect(text).toContain('tst · Testish');
    expect(text.indexOf('language.json')).toBeLessThan(text.indexOf('course.json'));
    expect(text).toContain('8 errors, 0 warnings in 1 language pack.');
  });
});

describe('validateContent checks', () => {
  let fixture: ReturnType<typeof copyFixture>;
  const file = (name: string) => path.join(fixture.pack, name);
  const run = () => validateContent({ contentRoot: fixture.root });

  afterEach(() => fixture.cleanup());

  it('finds no packs in an empty content folder', () => {
    fixture = copyFixture('valid');
    const report = validateContent({ contentRoot: path.join(fixture.root, 'languages') });
    expect(codes(report)).toEqual(['no-packs']);
  });

  it('stops at invalid JSON and skips the cross-reference checks', () => {
    fixture = copyFixture('valid');
    writeFileSync(file('course.json'), '{ "language": "tst", ');
    const report = run();
    expect(codes(report, 'error')).toEqual(['invalid-json', 'checks-skipped']);
    expect(report.packs[0]?.pack).toBeUndefined();
  });

  it('describes schema errors by entry id', () => {
    fixture = copyFixture('valid');
    editJson<LexiconFile>(file('lexicon.json'), (d) => {
      const entry = d.entries[2] as unknown as Record<string, unknown>;
      delete (entry['gloss'] as Record<string, unknown>)['ms'];
      entry['colour'] = 'blue';
    });
    const messages = find(run(), 'schema').map((i) => i.message);
    expect(messages).toContain('entries[tst-0003].gloss: missing required field "ms"');
    expect(messages).toContain('entries[tst-0003]: unknown field "colour"');
  });

  it('requires the folder name, code and file languages to agree', () => {
    fixture = copyFixture('valid');
    editJson<LanguageFile>(file('language.json'), (d) => {
      d.code = 'zzz';
    });
    const report = run();
    expect(find(report, 'pack-code')).toHaveLength(1);
    expect(find(report, 'language-mismatch')).toHaveLength(3);
    expect(find(report, 'id-prefix').map((i) => i.file)).toEqual([
      'lexicon.json',
      'sentences.json',
    ]);
  });

  it('requires a selectable default dialect', () => {
    fixture = copyFixture('valid');
    editJson<LanguageFile>(file('language.json'), (d) => {
      d.defaultDialect = 'shared';
    });
    expect(find(run(), 'default-dialect')[0]?.message).toContain('selectable: false');
  });

  it('rejects a status that the reviews of the current form do not support (D008)', () => {
    fixture = copyFixture('valid');
    editJson<LexiconFile>(file('lexicon.json'), (d) => {
      // A speaker reviewed an older spelling, so only one review counts.
      const entry = d.entries[0];
      if (entry?.review?.[1]) entry.review[1].form = 'alpha';
      // speaker-checked with no review at all.
      const draft = d.entries[5];
      if (draft) draft.status = 'speaker-checked';
    });
    const issues = find(run(), 'status-unsupported');
    expect(issues.map((i) => i.ids)).toEqual([['tst-0001'], ['tst-0006']]);
    expect(issues[0]?.message).toContain('needs 2 different speakers');
  });

  it('rejects reviews and audio from speakers missing from the credits', () => {
    fixture = copyFixture('valid');
    editJson<LexiconFile>(file('lexicon.json'), (d) => {
      d.entries[3]?.review?.push({
        speaker: 'SPK09',
        date: '2026-02-01',
        form: 'delta',
        verdict: 'ok',
      });
    });
    expect(find(run(), 'unknown-speaker')[0]?.message).toContain('SPK09');
  });

  it('checks audio names and forms', () => {
    fixture = copyFixture('valid');
    writeFileSync(file('audio/tst-0002__SPK01.m4a'), '');
    editJson<LexiconFile>(file('lexicon.json'), (d) => {
      const entry = d.entries[0];
      if (entry) entry.audio = [{ file: 'tst-0002__SPK01.m4a', speaker: 'SPK01', form: 'alfa?' }];
    });
    const report = run();
    expect(find(report, 'audio-name')[0]?.ids).toEqual(['tst-0001']);
    expect(find(report, 'audio-form')[0]?.message).toContain('"alfa?"');
    expect(find(report, 'unused-audio')[0]?.message).toContain('tst-0001__SPK01.m4a');
  });

  it('accepts a variant as the recorded form and a numbered take', () => {
    fixture = copyFixture('valid');
    writeFileSync(file('audio/tst-0003__SPK02_2.m4a'), '');
    editJson<LexiconFile>(file('lexicon.json'), (d) => {
      const entry = d.entries[2];
      if (entry)
        entry.audio = [{ file: 'tst-0003__SPK02_2.m4a', speaker: 'SPK02', form: 'charly' }];
    });
    expect(run().errors).toBe(0);
  });

  it('checks that sentence text matches its tokens', () => {
    fixture = copyFixture('valid');
    editJson<SentencesFile>(file('sentences.json'), (d) => {
      const s = d.entries[0];
      if (s) s.text = 'Alfa  delta.';
    });
    expect(find(run(), 'text-tokens')[0]?.ids).toEqual(['tst-s001']);
  });

  it('flags apostrophe look-alikes as errors without changing the form', () => {
    fixture = copyFixture('valid');
    editJson<LexiconFile>(file('lexicon.json'), (d) => {
      const entry = d.entries[1];
      if (entry) entry.form = 'bravo’';
    });
    const report = run();
    expect(find(report, 'non-ascii-apostrophe')[0]?.ids).toEqual(['tst-0002']);
    expect(report.packs[0]?.pack?.lexicon.entries[1]?.form).toBe('bravo’');
  });

  it('warns about lesson size, glosses, constructed items and repeated phrases', () => {
    fixture = copyFixture('valid');
    editJson<LexiconFile>(file('lexicon.json'), (d) => {
      const [, two, three, , five] = d.entries;
      if (two) two.gloss.en = 'Stone.';
      if (three) three.gloss.en = 'house (big) / stone';
      if (five) five.constructed = true;
    });
    editJson<SentencesFile>(file('sentences.json'), (d) => {
      const s = d.entries[1];
      if (s) {
        s.tokens = ['Echo', 'foxtrot'];
        s.text = 'Echo foxtrot!';
      }
    });
    editJson<CourseFile>(file('course.json'), (d) => {
      d.units[1]?.lessons[0]?.introduce.splice(2, 1);
    });
    const report = run();
    expect(report.errors).toBe(0);
    expect(find(report, 'same-gloss')[0]?.ids).toEqual(['tst-0001', 'tst-0002']);
    expect(find(report, 'overlapping-gloss')[0]?.ids).toEqual(['tst-0001', 'tst-0002', 'tst-0003']);
    expect(find(report, 'constructed')[0]?.ids).toEqual(['tst-0005']);
    expect(find(report, 'sentence-is-phrase')[0]?.ids).toEqual(['tst-s002', 'tst-0005']);
    expect(find(report, 'lesson-size')[0]?.message).toContain('"more-1" introduces 2 entries');
    expect(find(report, 'not-introduced')[0]?.ids).toEqual(['tst-0006']);
  });

  it('warns when forms are only told apart by characters the loose match ignores (D015)', () => {
    fixture = copyFixture('valid');
    editJson<LexiconFile>(file('lexicon.json'), (d) => {
      const golf = d.entries[5];
      if (golf) golf.form = 'bravo';
      const delta = d.entries[3];
      if (delta) delta.variants = [{ form: 'alfa' }];
    });
    const collisions = find(run(), 'loose-collision');
    expect(collisions.map((i) => i.ids)).toEqual([
      ['tst-0001', 'tst-0004'],
      ['tst-0002', 'tst-0006'],
    ]);
    expect(collisions[0]?.message).toContain('same written form');
    expect(collisions[1]?.message).toContain('A typed "bravo" is "close"');
  });

  it('warns about spacing, decomposed accents and ellipses in forms', () => {
    fixture = copyFixture('valid');
    editJson<LexiconFile>(file('lexicon.json'), (d) => {
      const [one, two, three] = d.entries;
      if (one) one.form = 'alfa ';
      if (two) two.form = `bravo${String.fromCharCode(0x301)}'`;
      if (three) three.form = 'charlie …';
    });
    const report = run();
    expect(find(report, 'spacing')[0]?.ids).toEqual(['tst-0001']);
    expect(find(report, 'not-nfc')[0]?.ids).toEqual(['tst-0002']);
    expect(find(report, 'ellipsis-in-form')[0]?.ids).toEqual(['tst-0003']);
  });

  it('warns about unknown JSON files and ignores proposals/', () => {
    fixture = copyFixture('valid');
    writeFileSync(file('lexicon-old.json'), '{}');
    mkdirSync(file('proposals'));
    writeFileSync(file('proposals/2026-01-spk01.json'), '{ "not": "a pack file" }');
    const report = run();
    expect(find(report, 'unknown-file').map((i) => i.file)).toEqual(['lexicon-old.json']);
    expect(report.errors).toBe(0);
  });
});

describe('okSpeakers', () => {
  it('counts each speaker once, by their latest review of the current form', () => {
    const reviews = [
      { speaker: 'SPK01', date: '2026-01-01', form: 'x', verdict: 'ok' as const },
      { speaker: 'SPK01', date: '2026-02-01', form: 'x', verdict: 'fix' as const },
      { speaker: 'SPK02', date: '2026-01-01', form: 'x', verdict: 'ok' as const },
      { speaker: 'SPK02', date: '2026-01-01', form: 'x', verdict: 'ok' as const },
      { speaker: 'SPK03', date: '2026-03-01', form: 'y', verdict: 'ok' as const },
    ];
    expect([...okSpeakers(reviews, 'x')]).toEqual(['SPK02']);
    expect(okSpeakers(undefined, 'x').size).toBe(0);
  });
});

describe('glossParts', () => {
  it('splits on / , ; and drops brackets, articles and "to"', () => {
    expect(glossParts('They (two people) / them')).toEqual(['they', 'them']);
    expect(glossParts("I'm sorry.")).toEqual(['sorry']);
    expect(glossParts('to eat; a meal')).toEqual(['eat', 'meal']);
  });
});
