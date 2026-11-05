import type { ComponentPropsWithRef } from 'react';
import { Link, type LinkProps } from 'react-router';
import { cx } from './cx';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'ghost';

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', type = 'button', className, ...rest }: ButtonProps) {
  // type defaults to "button" so a Button inside a form never submits by surprise.
  return <button type={type} className={cx(styles.button, styles[variant], className)} {...rest} />;
}

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
}

/** A router link that looks like a Button, for actions that change the screen. */
export function ButtonLink({ variant = 'primary', className, ...rest }: ButtonLinkProps) {
  return <Link className={cx(styles.button, styles[variant], className)} {...rest} />;
}
