import { Global } from '@emotion/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ThemeProvider from './components/theme-provider.tsx';
import { globalStyles } from './themes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Global styles={globalStyles} />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
