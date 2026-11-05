import { useT } from '../../i18n';
import { ButtonLink, Card, Screen } from '../../ui';

export function LessonScreen() {
  const t = useT();
  return (
    <Screen title={t('lesson.title')}>
      <Card>
        <p>{t('lesson.placeholder')}</p>
        <ButtonLink to="/" variant="ghost">
          {t('lesson.backToPath')}
        </ButtonLink>
      </Card>
    </Screen>
  );
}
