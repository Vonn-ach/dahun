/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Fixed port so Playwright and the docs can rely on it.
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: {
      // Vitest blanks CSS by default; tokens.test.ts needs the real file.
      include: [/tokens\.css/],
      // Keep CSS-module class names readable so tests can assert on them.
      modules: { classNameStrategy: 'non-scoped' },
    },
  },
});
