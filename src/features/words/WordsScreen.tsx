import { useT } from '../../i18n';
import { Card, Screen } from '../../ui';

export function WordsScreen() {
  const t = useT();
  return (
    <Screen title={t('words.title')}>
      <Card>
        <p>{t('words.placeholder')}</p>
      </Card>
    </Screen>
  );
}
