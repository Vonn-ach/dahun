import { Suspense, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router';
import { useT } from '../i18n';
import { SettingsIcon } from './icons';
import { MainNav } from './MainNav';
import { PreviewBanner } from './PreviewBanner';
import styles from './Layout.module.css';

export function Layout() {
  const t = useT();
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const lastPathname = useRef(pathname);

  // In a single-page app the browser doesn't announce a new page, so move
  // focus to the new screen's heading. Skipped on first load, and safe under
  // StrictMode's double effect because it compares paths instead of counting runs.
  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    mainRef.current?.querySelector<HTMLElement>('h1')?.focus();
  }, [pathname]);

  return (
    <div className={styles.shell}>
      <a href="#main" className={styles.skipLink}>
        {t('app.skipToContent')}
      </a>
      <PreviewBanner />
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand} aria-label={t('nav.home')}>
            {t('app.name')}
          </Link>
          <MainNav />
          <NavLink to="/settings" className={styles.settings}>
            <SettingsIcon />
            <span className={styles.settingsLabel}>{t('nav.settings')}</span>
          </NavLink>
        </div>
      </header>
      <main id="main" ref={mainRef} tabIndex={-1} className={styles.main}>
        {/* Screens suspend while the course bundle loads (one chunk per language). */}
        <Suspense
          fallback={
            <p role="status" className={styles.loading}>
              {t('content.loading')}
            </p>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <ScrollRestoration />
    </div>
  );
}
