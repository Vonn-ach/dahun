import { describe, expect, it } from 'vitest';
import { countLevels, levelForBox } from './levels';

describe('levelForBox', () => {
  it.each([
    [0, 'new'],
    [1, 'learning'],
    [2, 'learning'],
    [3, 'known'],
    [4, 'known'],
    [5, 'longterm'],
    [6, 'longterm'],
  ] as const)('box %i is %s', (box, level) => {
    expect(levelForBox(box)).toBe(level);
  });

  it('rejects boxes that cannot exist', () => {
    expect(() => levelForBox(-1)).toThrow(RangeError);
    expect(() => levelForBox(1.5)).toThrow(RangeError);
  });
});

describe('countLevels', () => {
  it('counts every level, including ones with no items', () => {
    expect(countLevels(['new', 'known', 'known'])).toEqual({
      new: 1,
      learning: 0,
      known: 2,
      longterm: 0,
    });
  });
});
