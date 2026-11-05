import type { ReactElement } from 'react';
import { NavLink } from 'react-router';
import { useT, type MessageKey } from '../i18n';
import { LearnIcon, PracticeIcon, ProgressIcon, WordsIcon } from './icons';
import styles from './MainNav.module.css';

interface NavItem {
  to: string;
  label: MessageKey;
  icon: () => ReactElement;
}

const ITEMS: readonly NavItem[] = [
  { to: '/', label: 'nav.learn', icon: LearnIcon },
  { to: '/practice', label: 'nav.practice', icon: PracticeIcon },
  { to: '/words', label: 'nav.words', icon: WordsIcon },
  { to: '/progress', label: 'nav.progress', icon: ProgressIcon },
];

/**
 * One <nav> for every screen size, so assistive tech always finds a single
 * main navigation. CSS moves it to the bottom of the screen on phones.
 */
export function MainNav() {
  const t = useT();
  return (
    <nav aria-label={t('nav.label')} className={styles.nav}>
      <ul className={styles.list}>
        {ITEMS.map(({ to, label, icon: ItemIcon }) => (
          <li key={to}>
            {/* "end" so Learn isn't marked current on every route under "/". */}
            <NavLink to={to} end={to === '/'} className={styles.link}>
              <ItemIcon />
              <span>{t(label)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
