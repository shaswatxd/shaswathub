'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    try {
      const lastTracked = sessionStorage.getItem('shaswathub_tracked');
      const now = Date.now();

      // Only send if not tracked in current tab session (or > 10 mins ago)
      if (!lastTracked || now - parseInt(lastTracked, 10) > 10 * 60 * 1000) {
        sessionStorage.setItem('shaswathub_tracked', now.toString());

        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referrer: document.referrer || '',
            path: window.location.pathname + window.location.search,
          }),
        }).catch(() => {
          // Silent error handling — visitor sees nothing
        });
      }
    } catch (e) {
      // Ignore errors silently
    }
  }, []);

  return null;
}
