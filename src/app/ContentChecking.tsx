import { localize, type Course } from '../content';
import { useLocale, useT } from '../i18n';
import { Card } from '../ui';
import styles from './ContentChecking.module.css';

interface ContentCheckingProps {
  /** The current course, or undefined when the build has no course at all. */
  course: Course | undefined;
}

/**
 * Shown instead of lessons or words when a build has nothing checked yet,
 * e.g. a release build before speakers have verified any entries.
 */
export function ContentChecking({ course }: ContentCheckingProps) {
  const t = useT();
  const { locale } = useLocale();

  if (!course) {
    return (
      <Card as="section" aria-labelledby="content-none-title">
        <h2 id="content-none-title" className={styles.title}>
          {t('content.none.title')}
        </h2>
        <p>{t('content.none.body')}</p>
      </Card>
    );
  }

  const { verifiedEntries, totalEntries } = course.bundle.stats;
  return (
    <Card as="section" aria-labelledby="content-checking-title">
      <h2 id="content-checking-title" className={styles.title}>
        {t('content.checking.title')}
      </h2>
      <p>{t('content.checking.body', { language: localize(course.bundle.name, locale) })}</p>
      <p className={styles.progress}>
        {t('content.checking.progress', { verified: verifiedEntries, total: totalEntries })}
      </p>
    </Card>
  );
}
