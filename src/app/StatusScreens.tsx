import { useT } from '../i18n';
import { ButtonLink, Card, Screen } from '../ui';
import styles from './StatusScreens.module.css';

export function NotFoundScreen() {
  const t = useT();
  return (
    <Screen title={t('notFound.title')}>
      <Card>
        <p>{t('notFound.body')}</p>
        <ButtonLink to="/">{t('notFound.home')}</ButtonLink>
      </Card>
    </Screen>
  );
}

/** Shown by the router when a screen throws, instead of a blank page. */
export function ErrorScreen() {
  const t = useT();
  return (
    <main className={styles.errorMain}>
      <Screen title={t('error.title')}>
        <p>{t('error.body')}</p>
      </Screen>
    </main>
  );
}
