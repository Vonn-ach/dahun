import { describe, expect, it } from 'vitest';
import tokensCss from './tokens.css?raw';

/** Reads `--name: value;` declarations from the first block that follows `selector`. */
function block(selector: string): Map<string, string> {
  const start = tokensCss.indexOf(selector);
  if (start === -1) throw new Error(`Selector not found in tokens.css: ${selector}`);
  const open = tokensCss.indexOf('{', start);
  const close = tokensCss.indexOf('}', open);
  const body = tokensCss.slice(open + 1, close);
  return new Map(
    [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1]!, m[2]!.trim()] as const),
  );
}

const light = block(':root {');
const darkMedia = block(":root:not([data-theme='light'])");
const darkAttr = block(":root[data-theme='dark']");

function luminance(hex: string): number {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(n.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum ratio]. 4.5 for text, 3 for UI edges and icons.
const PAIRS: ReadonlyArray<readonly [string, string, number]> = [
  ['--color-text', '--color-bg', 4.5],
  ['--color-text', '--color-surface', 4.5],
  ['--color-text-muted', '--color-bg', 4.5],
  ['--color-text-muted', '--color-surface', 4.5],
  ['--color-primary', '--color-bg', 4.5],
  ['--color-primary', '--color-surface', 4.5],
  ['--color-on-primary-fill', '--color-primary-fill', 4.5],
  ['--color-on-primary-fill', '--color-primary-fill-hover', 4.5],
  ['--color-text', '--color-primary-soft', 4.5],
  ['--color-primary', '--color-primary-soft', 4.5],
  ['--color-on-accent', '--color-accent', 4.5],
  ['--color-text', '--color-accent-soft', 4.5],
  ['--color-accent-text', '--color-surface', 4.5],
  ['--color-danger', '--color-bg', 4.5],
  ['--color-danger', '--color-surface', 4.5],
  ['--color-on-danger-fill', '--color-danger-fill', 4.5],
  ['--color-text', '--color-danger-soft', 4.5],
  ['--color-border-strong', '--color-bg', 3],
  ['--color-border-strong', '--color-surface', 3],
  ['--color-focus', '--color-bg', 3],
  ['--color-focus', '--color-surface', 3],
  ['--bead-ring', '--color-surface', 3],
  ['--bead-learning-edge', '--color-surface', 3],
  ['--bead-known', '--color-surface', 3],
  ['--bead-dot', '--bead-known', 3],
];

describe('design tokens', () => {
  it('keeps the two copies of the dark theme identical', () => {
    expect(Object.fromEntries(darkAttr)).toEqual(Object.fromEntries(darkMedia));
  });

  it('only overrides tokens that the light theme defines', () => {
    for (const name of darkMedia.keys()) expect(light.has(name), name).toBe(true);
  });

  it.each([
    ['light', light],
    ['dark', new Map([...light, ...darkMedia])],
  ] as const)('meets contrast targets in the %s theme', (_name, theme) => {
    for (const [fg, bg, min] of PAIRS) {
      const ratio = contrast(theme.get(fg)!, theme.get(bg)!);
      expect(ratio, `${fg} on ${bg}`).toBeGreaterThanOrEqual(min);
    }
  });
});
