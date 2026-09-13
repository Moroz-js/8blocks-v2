'use client'

import { useEffect } from 'react'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'

/**
 * Site-wide interaction tracking → `dataLayer` (GTM) + PostHog via `trackPlatformEvent`.
 *
 * One delegated click listener classifies anchors by destination, so GTM triggers
 * can key off stable event names instead of CSS selectors:
 *  - `calendly_click`      href → calendly.com            { location, calendly_url }
 *  - `contact_click`       mailto: / tel: / t.me / wa.me   { channel, location }
 *  - `file_download`       href ends with .pdf or /pdf     { file_url, location }
 *  - `outbound_click`      other external hosts            { link_domain, link_url, location }
 *  - `cta_click`           any element with data-cta       { target: data-cta, location }
 *
 * Calendly inline/popup widget posts `calendly.*` messages → `calendly_event_scheduled`,
 * `calendly_date_and_time_selected`, `calendly_profile_page_viewed`.
 *
 * `location` = closest section id / data-section, else pathname.
 */

const CALENDLY_EVENTS: Record<string, string> = {
  'calendly.profile_page_viewed': 'calendly_profile_page_viewed',
  'calendly.event_type_viewed': 'calendly_event_type_viewed',
  'calendly.date_and_time_selected': 'calendly_date_and_time_selected',
  'calendly.event_scheduled': 'calendly_event_scheduled',
}

function locationOf(el: Element | null): string {
  const section = el?.closest<HTMLElement>('[data-section], section[id], [id^="section-"]')
  return (
    section?.dataset.section ||
    section?.id ||
    (typeof window !== 'undefined' ? window.location.pathname : '')
  )
}

function onClick(e: MouseEvent): void {
  const target = e.target as Element | null
  const cta = target?.closest<HTMLElement>('[data-cta]')
  if (cta?.dataset.cta) {
    trackPlatformEvent('cta_click', { target: cta.dataset.cta, location: locationOf(cta) })
  }

  const a = target?.closest<HTMLAnchorElement>('a[href]')
  if (!a) return
  const href = a.getAttribute('href') || ''
  const location = locationOf(a)

  if (/^mailto:/i.test(href)) return void trackPlatformEvent('contact_click', { channel: 'email', location })
  if (/^tel:/i.test(href)) return void trackPlatformEvent('contact_click', { channel: 'phone', location })

  let url: URL
  try {
    url = new URL(href, window.location.href)
  } catch {
    return
  }
  const host = url.hostname.replace(/^www\./, '')

  if (host.endsWith('calendly.com')) {
    return void trackPlatformEvent('calendly_click', { location, calendly_url: url.origin + url.pathname })
  }
  if (host === 't.me' || host === 'telegram.me') return void trackPlatformEvent('contact_click', { channel: 'telegram', location })
  if (host === 'wa.me' || host.endsWith('whatsapp.com')) return void trackPlatformEvent('contact_click', { channel: 'whatsapp', location })

  if (/\.pdf$/i.test(url.pathname) || /\/pdf$/i.test(url.pathname)) {
    return void trackPlatformEvent('file_download', { file_url: url.pathname, location })
  }

  if (url.origin !== window.location.origin) {
    trackPlatformEvent('outbound_click', { link_domain: host, link_url: url.href.slice(0, 200), location })
  }
}

function onMessage(e: MessageEvent): void {
  const data = e.data as { event?: string; payload?: { event?: { uri?: string }; invitee?: { uri?: string } } } | undefined
  const name = data?.event && CALENDLY_EVENTS[data.event]
  if (!name || !/calendly\.com$/.test(new URL(e.origin).hostname)) return
  trackPlatformEvent(name, {
    location: window.location.pathname,
    ...(data.payload?.event?.uri ? { calendly_event_uri: data.payload.event.uri } : {}),
  })
}

export function SiteEventTracker() {
  useEffect(() => {
    document.addEventListener('click', onClick, { capture: true })
    window.addEventListener('message', onMessage)
    return () => {
      document.removeEventListener('click', onClick, { capture: true })
      window.removeEventListener('message', onMessage)
    }
  }, [])
  return null
}
