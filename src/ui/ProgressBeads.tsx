import { countLevels, type Level } from '../engine';
import { useT } from '../i18n';
import { cx } from './cx';
import styles from './ProgressBeads.module.css';

interface ProgressBeadsProps {
  /** One level per item, in display order (e.g. one bead per entry in a unit). */
  levels: readonly Level[];
  /** Overrides the default spoken summary, e.g. to name the unit. */
  label?: string;
  className?: string;
}

/**
 * A string of beads in the style of Orang Ulu beadwork, one per item.
 * Each level has its own shape (ring, half, full, full with a core) as well as
 * its own colour, and screen readers hear a count per level instead of the beads.
 */
export function ProgressBeads({ levels, label, className }: ProgressBeadsProps) {
  const t = useT();
  const summary = label ?? t('beads.summary', countLevels(levels));

  return (
    <div role="img" aria-label={summary} className={cx(styles.beads, className)}>
      {levels.map((level, index) => (
        <span key={index} className={cx(styles.bead, styles[level])} data-level={level} />
      ))}
    </div>
  );
}
