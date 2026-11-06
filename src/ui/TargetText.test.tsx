import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { splitHighlights, TargetText } from './TargetText';

// Placeholder strings, not words in any language.
describe('splitHighlights', () => {
  it('marks each highlighted character and keeps everything else', () => {
    expect(splitHighlights("ab'cd'", ["'"])).toEqual([
      { text: 'ab', highlight: false },
      { text: "'", highlight: true },
      { text: 'cd', highlight: false },
      { text: "'", highlight: true },
    ]);
  });

  it('returns the text as one plain run when nothing is highlighted', () => {
    expect(splitHighlights('abc', [])).toEqual([{ text: 'abc', highlight: false }]);
    expect(splitHighlights('', ["'"])).toEqual([]);
  });
});

describe('TargetText', () => {
  it('renders the text unchanged, with its language and highlights', () => {
    const { container } = render(<TargetText text="ab'c" lang="tst" highlight={["'"]} />);
    const outer = container.firstElementChild;
    expect(outer).toHaveAttribute('lang', 'tst');
    expect(outer).toHaveTextContent("ab'c");
    expect(container.querySelectorAll('[data-highlight]')).toHaveLength(1);
  });
});
