import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import { existsSync, readdirSync } from 'node:fs';

// Golden rule 5: no code may branch on a specific language pack. Every folder
// in content/languages/ is a pack code, so none of them may appear as a literal.
const languagesDir = new URL('./content/languages/', import.meta.url);
const packCodes = existsSync(languagesDir)
  ? readdirSync(languagesDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && /^[a-z]{3}$/.test(d.name))
      .map((d) => d.name)
  : [];

export default tseslint.config(
  {
    ignores: ['dist/', 'coverage/', 'playwright-report/', 'test-results/', 'src/generated/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        // Two programs: the browser app, and Node-side config + e2e tests.
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // `const { review, ...rest } = entry` is how the content build leaves fields out.
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      ...tseslint.configs.disableTypeChecked.languageOptions,
      globals: globals.node,
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ...reactHooks.configs.flat['recommended-latest'],
  },
  {
    files: ['src/**/*.tsx'],
    ...jsxA11y.flatConfigs.recommended,
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      globals: globals.browser,
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...packCodes.map((code) => ({
          // Golden rule 5: the app never branches on a specific language pack.
          selector: `Literal[value='${code}']`,
          message:
            'Language-specific behaviour belongs in language.json, not in code (CLAUDE.md golden rule 5).',
        })),
        {
          // UI text goes through useT() so it can be translated, and so no
          // indigenous-language text can slip into components by accident.
          selector: 'JSXText[value=/\\S/]',
          message: 'No hard-coded UI text. Add a key to src/i18n/en.json and use useT().',
        },
      ],
    },
  },
  {
    // `await act(async () => …)` is how tests let React finish suspended work,
    // even when the callback itself awaits nothing.
    files: ['**/*.test.{ts,tsx}'],
    rules: { '@typescript-eslint/require-await': 'off' },
  },
  prettier,
);
