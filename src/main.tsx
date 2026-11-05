import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Fonts are bundled from npm rather than loaded from Google Fonts, so they work
// offline and no third-party request is made. Latin covers English, Malay and
// the current language packs (including é); add subsets here if a pack needs more.
import '@fontsource/atkinson-hyperlegible/latin-400.css';
import '@fontsource/atkinson-hyperlegible/latin-400-italic.css';
import '@fontsource/atkinson-hyperlegible/latin-700.css';
import '@fontsource-variable/bricolage-grotesque/wght.css';
import './styles/global.css';

import { App } from './app/App';

const container = document.getElementById('root');
if (!container) throw new Error('index.html is missing <div id="root">');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
