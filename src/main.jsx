import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// ── PWA install prompt ────────────────────────────────────────────────
window.__pwaPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__pwaPrompt = e;
  window.dispatchEvent(new Event('pwaPromptReady'));
});

// ── Service Worker registration with auto-update ──────────────────────
// When a new version is deployed, the SW detects a change, installs in the
// background, and reloads the page automatically once the new SW activates.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        // Check for updates immediately on page load
        reg.update();

        // When a new SW is found and installed, activate it right away
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            // New SW installed and ready; send SKIP_WAITING then reload
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              newWorker.postMessage('SKIP_WAITING');
            }
          });
        });
      })
      .catch(() => {});

    // When the SW controller changes (new SW took over), reload the page
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!reloading) {
        reloading = true;
        window.location.reload();
      }
    });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
