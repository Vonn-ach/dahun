import { useT } from '../../i18n';
import { Card, Screen } from '../../ui';

export function CreditsScreen() {
  const t = useT();
  return (
    <Screen title={t('credits.title')}>
      <Card>
        <p>{t('credits.placeholder')}</p>
      </Card>
    </Screen>
  );
}
