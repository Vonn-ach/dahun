import { useContentChannel } from '../content';
import { useT } from '../i18n';
import styles from './PreviewBanner.module.css';

/**
 * A permanent label on every screen of a build that includes unverified
 * content (D007 for draft, D008 for beta). It can't be dismissed.
 */
export function PreviewBanner() {
  const t = useT();
  const channel = useContentChannel();
  if (channel === 'release') return null;
  const draft = channel === 'draft';
  return (
    <div className={styles.banner} role="note">
      <strong className={styles.title}>
        {t(draft ? 'preview.draft.title' : 'preview.beta.title')}
      </strong>{' '}
      {t(draft ? 'preview.draft.body' : 'preview.beta.body')}
    </div>
  );
}
