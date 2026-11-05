import { Link } from 'react-router';
import { useT } from '../../i18n';
import { Card, Screen } from '../../ui';

export function SettingsScreen() {
  const t = useT();
  return (
    <Screen title={t('settings.title')}>
      <Card>
        <p>{t('settings.placeholder')}</p>
      </Card>
      <p>
        <Link to="/credits">{t('settings.credits')}</Link>
      </p>
    </Screen>
  );
}
