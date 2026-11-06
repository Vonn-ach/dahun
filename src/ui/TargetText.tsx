import { cx } from './cx';
import styles from './TargetText.module.css';

export interface TextPart {
  text: string;
  highlight: boolean;
}

/** Splits text into plain runs and the characters a language asks the UI to highlight. */
export function splitHighlights(text: string, chars: readonly string[]): TextPart[] {
  const wanted = chars.filter(Boolean);
  if (wanted.length === 0) return text ? [{ text, highlight: false }] : [];
  const parts: TextPart[] = [];
  let plain = '';
  for (const ch of text) {
    if (wanted.includes(ch)) {
      if (plain) parts.push({ text: plain, highlight: false });
      parts.push({ text: ch, highlight: true });
      plain = '';
    } else {
      plain += ch;
    }
  }
  if (plain) parts.push({ text: plain, highlight: false });
  return parts;
}

interface TargetTextProps {
  /** A form exactly as it is in the content. It is never changed, only marked up. */
  text: string;
  /** The language code, so screen readers and fonts treat it as that language. */
  lang: string;
  /** Characters to highlight, from language.json → orthography.highlight (e.g. the glottal stop). */
  highlight?: readonly string[];
  className?: string;
}

/** Shows target-language text, highlighting characters such as the glottal stop. */
export function TargetText({ text, lang, highlight = [], className }: TargetTextProps) {
  return (
    <span lang={lang} className={cx(styles.text, className)}>
      {splitHighlights(text, highlight).map((part, i) =>
        part.highlight ? (
          <span key={i} className={styles.highlight} data-highlight="">
            {part.text}
          </span>
        ) : (
          part.text
        ),
      )}
    </span>
  );
}
