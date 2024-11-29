import { useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';

export function usePWA() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      const wb = new Workbox('/sw.js');

      const updateCallback = () => {
        setIsUpdateAvailable(true);
      };

      wb.addEventListener('waiting', updateCallback);
      wb.register().then(setRegistration);

      return () => {
        wb.removeEventListener('waiting', updateCallback);
      };
    }
  }, []);

  const update = async () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      registration.waiting.addEventListener('statechange', (e) => {
        if ((e.target as ServiceWorker).state === 'activated') {
          window.location.reload();
        }
      });
    }
  };

  return { isUpdateAvailable, update };
}