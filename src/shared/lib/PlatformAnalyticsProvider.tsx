'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import {
  POSTHOG_HOST,
  POSTHOG_KEY,
} from '@/shared/lib/platform-analytics'

export function PlatformAnalyticsProvider() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!POSTHOG_KEY || posthog.__loaded) return
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true,
      persistence: 'localStorage+cookie',
    })
  }, [])

  useEffect(() => {
    if (!POSTHOG_KEY || !posthog.__loaded) return
    const cleaned = new URLSearchParams(searchParams?.toString() ?? '')
    cleaned.delete('m')
    cleaned.delete('a')
    const query = cleaned.toString()
    posthog.capture('$pageview', {
      $current_url: `${window.location.origin}${pathname}${query ? `?${query}` : ''}`,
    })
  }, [pathname, searchParams])

  return null
}
