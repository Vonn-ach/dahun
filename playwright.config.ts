import { defineConfig, devices } from '@playwright/test';

// Not the normal dev port (5173): the e2e server runs the fixture course from
// tests/fixtures/, so it must never be mistaken for, or reuse, a dev server
// showing real content.
const PORT = 5174;
const isCI = !!process.env['CI'];

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      // The main users are on Android phones; 360px is the narrowest common width.
      name: 'Pixel',
      use: { ...devices['Pixel 7'], viewport: { width: 360, height: 800 } },
    },
    {
      name: 'Desktop',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // The dev server is enough for smoke tests and needs no build first. It runs
  // on the placeholder "tst" course, so the tests don't depend on how many real
  // words a pack has (D016). Prompt 07 (offline/PWA) should switch this to
  // `vite preview` of a real build.
  webServer: {
    command: 'npm run dev:e2e',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
});
