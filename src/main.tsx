// ============================================================
// MAIN ENTRY POINT
// src/main.tsx
// ============================================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App            from './App';
import Providers      from './app/Providers';
import './index.css';

async function enableMocking() {
  if (import.meta.env.VITE_MOCK_API !== 'true') {
    return;
  }

  const { worker } = await import('./test/__mocks__/browser');
  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Providers>
        <App />
      </Providers>
    </StrictMode>
  );
});
