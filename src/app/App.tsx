import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { I18nProvider } from '../i18n';
import { routes } from './routes';

const router = createBrowserRouter(routes);

export function App() {
  return (
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  );
}
