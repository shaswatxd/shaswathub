'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrer: document.referrer || '',
          path: window.location.pathname + window.location.search,
        }),
      }).catch(() => {});
    } catch (e) {}
  }, []);

  return null;
}
