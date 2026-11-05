import type { ReactNode } from 'react';
import { cx } from './cx';
import styles from './Badge.module.css';

/** "warning" is for draft content, "accent" for dialect or source labels. */
export type BadgeTone = 'neutral' | 'accent' | 'warning' | 'danger';

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return <span className={cx(styles.badge, styles[tone], className)}>{children}</span>;
}
