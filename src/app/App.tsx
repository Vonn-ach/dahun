import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { ContentProvider } from '../content';
import { generatedSource } from '../content/generatedSource';
import { I18nProvider } from '../i18n';
import { routes } from './routes';

const router = createBrowserRouter(routes);

export function App() {
  return (
    <I18nProvider>
      <ContentProvider source={generatedSource}>
        <RouterProvider router={router} />
      </ContentProvider>
    </I18nProvider>
  );
}
