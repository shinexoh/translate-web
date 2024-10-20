import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ThemeProvider from './components/theme-provider.tsx';
import { Global } from '@emotion/react';
import { globalStyles } from './themes';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Global styles={globalStyles} />
      <App />
    </ThemeProvider>
  </StrictMode>
);
