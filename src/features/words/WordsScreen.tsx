import { useId, useMemo, useState } from 'react';
import { ContentChecking } from '../../app/ContentChecking';
import { localize, useCurrentCourse, type Course } from '../../content';
import { useLocale, useT } from '../../i18n';
import { Card, Chip, Screen } from '../../ui';
import { filterWords, indexWords } from './filterWords';
import { WordRow } from './WordRow';
import styles from './WordsScreen.module.css';

export function WordsScreen() {
  const t = useT();
  const course = useCurrentCourse();
  return (
    <Screen title={t('words.title')}>
      {course && course.entries.length > 0 ? (
        <WordList course={course} />
      ) : (
        <ContentChecking course={course} />
      )}
    </Screen>
  );
}

function WordList({ course }: { course: Course }) {
  const t = useT();
  const { locale } = useLocale();
  const searchId = useId();
  const [query, setQuery] = useState('');
  const [unitId, setUnitId] = useState<string | null>(null);

  const words = useMemo(() => indexWords(course), [course]);
  const rules = course.bundle.orthography.normalization;
  const shown = useMemo(
    () => filterWords(words, { query, unitId }, rules),
    [words, query, unitId, rules],
  );

  return (
    <>
      <div className={styles.controls}>
        <label htmlFor={searchId} className={styles.searchLabel}>
          {t('words.searchLabel')}
        </label>
        <input
          id={searchId}
          type="search"
          className={styles.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('words.searchHint', { language: localize(course.bundle.name, locale) })}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
        />
        <div role="group" aria-label={t('words.unitFilter')} className={styles.chips}>
          <Chip selected={unitId === null} onClick={() => setUnitId(null)}>
            {t('words.allUnits')}
          </Chip>
          {course.units.map((unit) => (
            <Chip key={unit.id} selected={unitId === unit.id} onClick={() => setUnitId(unit.id)}>
              {localize(unit.title, locale)}
            </Chip>
          ))}
        </div>
      </div>

      <p role="status" className={styles.count}>
        {t('words.count', { shown: shown.length, total: course.entries.length })}
      </p>

      {shown.length === 0 ? (
        <p>{t('words.noMatches')}</p>
      ) : (
        <Card>
          <ul className={styles.list} aria-label={t('words.listLabel')}>
            {shown.map((entry) => (
              <WordRow key={entry.id} entry={entry} course={course} />
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
