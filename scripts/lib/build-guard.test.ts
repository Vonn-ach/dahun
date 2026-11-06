import { describe, expect, it } from 'vitest';
import { checkBuildChannel } from './build-guard';

describe('checkBuildChannel', () => {
  it('lets a release bundle through any build', () => {
    expect(checkBuildChannel('release', 'production', false)).toBeUndefined();
  });

  it('allows a draft bundle only in draft mode', () => {
    expect(checkBuildChannel('draft', 'draft', false)).toBeUndefined();
    expect(checkBuildChannel('draft', 'production', true)).toContain('"draft" content bundle');
  });

  it('allows a beta bundle only when speaker-checked content was asked for', () => {
    expect(checkBuildChannel('beta', 'production', true)).toBeUndefined();
    expect(checkBuildChannel('beta', 'production', false)).toContain('"beta"');
  });

  it('stops a build with no bundle at all', () => {
    expect(checkBuildChannel(undefined, 'production', false)).toContain('"missing"');
  });
});
