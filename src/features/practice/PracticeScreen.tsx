import { useT } from '../../i18n';
import { Card, Screen } from '../../ui';

export function PracticeScreen() {
  const t = useT();
  return (
    <Screen title={t('practice.title')}>
      <Card>
        <p>{t('practice.placeholder')}</p>
      </Card>
    </Screen>
  );
}
