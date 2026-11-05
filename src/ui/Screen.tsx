import { useEffect, type ReactNode } from 'react';
import { useT } from '../i18n';
import styles from './Screen.module.css';

interface ScreenProps {
  title: string;
  children?: ReactNode;
}

/**
 * The frame every route screen uses: one <h1> and the document title.
 * The h1 takes focus after navigation (see app/Layout), so it is focusable
 * from script but not in the tab order.
 */
export function Screen({ title, children }: ScreenProps) {
  const t = useT();

  useEffect(() => {
    document.title = t('app.documentTitle', { page: title, app: t('app.name') });
  }, [title, t]);

  return (
    <div className={styles.screen}>
      <h1 tabIndex={-1} className={styles.title}>
        {title}
      </h1>
      {children}
    </div>
  );
}
