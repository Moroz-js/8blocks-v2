'use client'

import posthog from 'posthog-js'

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

export type PlatformEventParams = Record<
  string,
  string | number | boolean | undefined
>

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

function attribution(): PlatformEventParams {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const result: PlatformEventParams = {}
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign'] as const) {
    const value = params.get(key)
    if (value) result[key] = value
  }
  if (document.referrer) result.referrer = document.referrer
  return result
}

export function trackPlatformEvent(
  event: string,
  params: PlatformEventParams = {},
): void {
  if (typeof window === 'undefined') return
  const properties = { ...attribution(), ...params }
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...properties })
  if (POSTHOG_KEY && posthog.__loaded) {
    posthog.capture(event, properties)
  }
}
