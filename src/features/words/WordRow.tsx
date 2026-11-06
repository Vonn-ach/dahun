import { localize, type BundleEntry, type Course } from '../../content';
import { useLocale, useT, type Locale } from '../../i18n';
import { Badge, TargetText } from '../../ui';
import styles from './WordsScreen.module.css';

interface WordRowProps {
  entry: BundleEntry;
  course: Course;
}

interface VariantLine {
  /** A dialect name, or undefined for the plain "Also:" line. */
  dialect: string | undefined;
  forms: string[];
}

/**
 * Variants that belong to a dialect a learner can choose get a line with that
 * dialect's name; the rest go on one "Also:" line (D009).
 */
function variantLines(entry: BundleEntry, course: Course, locale: Locale): VariantLine[] {
  const lines = new Map<string | undefined, string[]>();
  for (const variant of entry.variants ?? []) {
    const dialect = variant.dialect ? course.getDialect(variant.dialect) : undefined;
    const label = dialect?.selectable ? localize(dialect.name, locale) : undefined;
    lines.set(label, [...(lines.get(label) ?? []), variant.form]);
  }
  return [...lines].map(([dialect, forms]) => ({ dialect, forms }));
}

export function WordRow({ entry, course }: WordRowProps) {
  const t = useT();
  const { locale } = useLocale();
  const highlight = course.bundle.orthography.highlight ?? [];
  const dialect = course.getDialect(entry.dialect);
  const sources = entry.sources.flatMap((key) => {
    const source = course.getSource(key);
    return source ? [{ key, title: source.title }] : [];
  });

  return (
    <li className={styles.row} data-entry-id={entry.id}>
      <div className={styles.head}>
        <TargetText
          text={entry.form}
          lang={course.code}
          highlight={highlight}
          className={styles.form}
        />
        <span className={styles.badges}>
          {entry.status === 'draft' && <Badge tone="warning">{t('words.draft')}</Badge>}
          {entry.status === 'speaker-checked' && <Badge>{t('words.speakerChecked')}</Badge>}
          {/* "Shared / not yet checked" isn't a dialect a learner can pick, so it gets no badge. */}
          {dialect?.selectable && <Badge tone="accent">{localize(dialect.name, locale)}</Badge>}
        </span>
      </div>
      <p className={styles.gloss}>{localize(entry.gloss, locale)}</p>
      {variantLines(entry, course, locale).map((line) => (
        <p key={line.dialect ?? ''} className={styles.variants}>
          <span className={styles.label}>
            {line.dialect
              ? t('words.dialectLabel', { dialect: line.dialect })
              : t('words.alsoLabel')}
          </span>{' '}
          {line.forms.map((form, i) => (
            <span key={`${i}-${form}`}>
              {i > 0 && ', '}
              <TargetText text={form} lang={course.code} highlight={highlight} />
            </span>
          ))}
        </p>
      ))}
      {sources.length > 0 && (
        <div className={styles.sources}>
          <span className={styles.label}>{t('words.sourcesLabel')}</span>{' '}
          {/* A list, so screen readers read each source title separately. */}
          <ul className={styles.sourceList}>
            {sources.map((s) => (
              <li key={s.key} className={styles.source}>
                {s.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
