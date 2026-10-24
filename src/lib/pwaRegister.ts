export const registerServiceWorker = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered:', reg.scope);

          // Force check for new deployments on every page load
          reg.update();

          // Auto-reload when new service worker takes over control
          let refreshing = false;
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
              refreshing = true;
              console.log('[PWA] New version detected! Reloading for fresh update...');
              window.location.reload();
            }
          });
        })
        .catch((err) => {
          console.warn('[PWA] Registration failed:', err);
        });
    });
  }
};
