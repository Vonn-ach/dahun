import { useT } from '../../i18n';
import { Card, Screen } from '../../ui';

export function ProgressScreen() {
  const t = useT();
  return (
    <Screen title={t('progress.title')}>
      <Card>
        <p>{t('progress.placeholder')}</p>
      </Card>
    </Screen>
  );
}
