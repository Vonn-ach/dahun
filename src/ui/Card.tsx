import type { HTMLAttributes } from 'react';
import { cx } from './cx';
import styles from './Card.module.css';

type CardElement = 'div' | 'section' | 'article' | 'li';

interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Pick the element that fits the meaning, e.g. "li" inside a list of units. */
  as?: CardElement;
}

export function Card({ as: Element = 'div', className, ...rest }: CardProps) {
  return <Element className={cx(styles.card, className)} {...rest} />;
}
