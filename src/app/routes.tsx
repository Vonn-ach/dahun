import type { RouteObject } from 'react-router';
import { CreditsScreen } from '../features/credits';
import { LessonScreen } from '../features/lesson';
import { PathScreen } from '../features/path';
import { PracticeScreen } from '../features/practice';
import { ProgressScreen } from '../features/progress';
import { SettingsScreen } from '../features/settings';
import { WordsScreen } from '../features/words';
import { Layout } from './Layout';
import { ErrorScreen, NotFoundScreen } from './StatusScreens';

// Kept separate from the router instance so tests can mount the same routes
// in a memory router.
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorScreen />,
    children: [
      { index: true, element: <PathScreen /> },
      { path: 'lesson/:id', element: <LessonScreen /> },
      { path: 'practice', element: <PracticeScreen /> },
      { path: 'words', element: <WordsScreen /> },
      { path: 'progress', element: <ProgressScreen /> },
      { path: 'settings', element: <SettingsScreen /> },
      { path: 'credits', element: <CreditsScreen /> },
      { path: '*', element: <NotFoundScreen /> },
    ],
  },
];
