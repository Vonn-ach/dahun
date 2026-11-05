import { useT } from '../../i18n';
import { ButtonLink, Card, Screen } from '../../ui';

export function PathScreen() {
  const t = useT();
  return (
    <Screen title={t('path.title')}>
      <Card>
        <p>{t('path.placeholder')}</p>
        {/* Placeholder until prompt 02 provides real lesson ids from the content bundle. */}
        <ButtonLink to="/lesson/example">{t('path.sampleLesson')}</ButtonLink>
      </Card>
    </Screen>
  );
}
