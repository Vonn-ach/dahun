import { ContentChecking } from '../../app/ContentChecking';
import { useCurrentCourse } from '../../content';
import { useT } from '../../i18n';
import { ButtonLink, Card, Screen } from '../../ui';

export function PathScreen() {
  const t = useT();
  const course = useCurrentCourse();
  // The real learning path (units, lessons, beads) arrives in prompt 04.
  const firstLesson = course?.units[0]?.lessons[0];

  return (
    <Screen title={t('path.title')}>
      {firstLesson ? (
        <Card>
          <p>{t('path.placeholder')}</p>
          <ButtonLink to={`/lesson/${firstLesson.id}`}>{t('path.firstLesson')}</ButtonLink>
        </Card>
      ) : (
        <ContentChecking course={course} />
      )}
    </Screen>
  );
}
