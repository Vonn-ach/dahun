import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom has no layout, so it doesn't implement scrolling. The router's
// ScrollRestoration calls it on every navigation.
window.scrollTo = () => undefined;

// Vitest globals are off, so Testing Library can't register its own cleanup.
afterEach(() => {
  cleanup();
});
