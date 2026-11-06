import { describe, expect, it } from 'vitest';
import { checkBuildChannel } from './build-guard';

const real = (channel: string) => ({ channel, contentDir: 'content' });

describe('checkBuildChannel', () => {
  it('lets a release bundle through any build', () => {
    expect(checkBuildChannel(real('release'), 'production', false)).toBeUndefined();
  });

  it('allows a draft bundle only in draft mode', () => {
    expect(checkBuildChannel(real('draft'), 'draft', false)).toBeUndefined();
    expect(checkBuildChannel(real('draft'), 'production', true)).toContain(
      '"draft" content bundle',
    );
  });

  it('allows a beta bundle only when speaker-checked content was asked for', () => {
    expect(checkBuildChannel(real('beta'), 'production', true)).toBeUndefined();
    expect(checkBuildChannel(real('beta'), 'production', false)).toContain('"beta"');
  });

  it('stops a build with no bundle at all', () => {
    expect(checkBuildChannel(undefined, 'production', false)).toContain('"unknown"');
  });

  it('never builds the fixture course, even in draft mode', () => {
    const fixture = { channel: 'draft', contentDir: 'tests/fixtures/packs/valid' };
    expect(checkBuildChannel(fixture, 'draft', false)).toContain(
      'built from "tests/fixtures/packs/valid"',
    );
  });
});
