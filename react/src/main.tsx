import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@fontsource-variable/hanken-grotesk';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Offline support and install. Production only: the dev server must never be cached.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // The worker lives at the site root, so it serves both the start page and the app.
    navigator.serviceWorker.register('../sw.js', { scope: '../' }).catch(() => { /* the app still works online */ });
  });
}
