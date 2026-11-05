import type { ReactElement } from 'react';

// Simple stroke icons, drawn inline so there's no icon library to ship.
// They're decorative: every icon sits next to a visible text label.

function Icon({ children }: { children: ReactElement | ReactElement[] }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** A winding river path with stepping stones. */
export function LearnIcon() {
  return (
    <Icon>
      <path d="M5 20c0-4 4-4 7-6s7-2 7-6" />
      <circle cx="5" cy="20" r="1.5" />
      <circle cx="12" cy="14" r="1.5" />
      <circle cx="19" cy="8" r="1.5" />
      <path d="M19 4v1" />
    </Icon>
  );
}

/** Circular arrows: going round again. */
export function PracticeIcon() {
  return (
    <Icon>
      <path d="M20 12a8 8 0 0 1-14 5.3" />
      <path d="M4 12a8 8 0 0 1 14-5.3" />
      <path d="M18 3v4h-4" />
      <path d="M6 21v-4h4" />
    </Icon>
  );
}

/** An open book. */
export function WordsIcon() {
  return (
    <Icon>
      <path d="M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5" />
      <path d="M12 6c2-1.5 5-2 8-1.5V19c-3-.5-6 0-8 1.5" />
      <path d="M12 6v14.5" />
    </Icon>
  );
}

/** A string of beads. */
export function ProgressIcon() {
  return (
    <Icon>
      <path d="M3 12h18" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="18" cy="12" r="2.5" />
    </Icon>
  );
}

/** Sliders. */
export function SettingsIcon() {
  return (
    <Icon>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </Icon>
  );
}
