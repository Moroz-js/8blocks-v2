'use client'

import { useEffect } from 'react'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'

/** Reports 404 renders so broken internal/external links surface in GA4. */
export function NotFoundTracker() {
  useEffect(() => {
    trackPlatformEvent('page_not_found', {
      page_path: window.location.pathname + window.location.search,
      referrer: document.referrer || undefined,
    })
  }, [])
  return null
}
