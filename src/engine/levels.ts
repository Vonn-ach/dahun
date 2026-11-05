/**
 * Learner-facing levels for a Leitner box (docs/PEDAGOGY.md):
 * New (0), Learning (1–2), Known (3–4), Long-term (5–6).
 */
export type Level = 'new' | 'learning' | 'known' | 'longterm';

export const LEVELS: readonly Level[] = ['new', 'learning', 'known', 'longterm'];

export function levelForBox(box: number): Level {
  if (!Number.isInteger(box) || box < 0) {
    throw new RangeError(`Leitner box must be a whole number of 0 or more, got ${box}`);
  }
  if (box === 0) return 'new';
  if (box <= 2) return 'learning';
  if (box <= 4) return 'known';
  return 'longterm';
}

export function countLevels(levels: readonly Level[]): Record<Level, number> {
  const counts: Record<Level, number> = { new: 0, learning: 0, known: 0, longterm: 0 };
  for (const level of levels) counts[level] += 1;
  return counts;
}
