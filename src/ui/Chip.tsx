import type { ReactNode } from 'react';
import { cx } from './cx';
import styles from './Chip.module.css';

interface ChipProps {
  children: ReactNode;
  /** With onClick the chip is a toggle button; without it, a static label. */
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export function Chip({ children, onClick, selected = false, className }: ChipProps) {
  if (!onClick) {
    return <span className={cx(styles.chip, className)}>{children}</span>;
  }
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cx(styles.chip, styles.toggle, selected && styles.selected, className)}
    >
      {/* A tick as well as the colour change, so "selected" never relies on colour alone. */}
      {selected && (
        <svg className={styles.tick} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M3 8.5l3 3 7-7" />
        </svg>
      )}
      {children}
    </button>
  );
}
