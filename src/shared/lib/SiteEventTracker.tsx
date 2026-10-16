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

/** Internal destinations that count as a call-to-action (conversion page or product/service). */
const CTA_PATHS = /^\/(contact|services(\/|$)|product(\/|$)|learn\/)/

/** Zone of a click: header / footer / hero / sticky / body — for `cta_click.zone`. */
function zoneOf(el: Element): string {
  if (el.closest('header')) return 'header'
  if (el.closest('footer')) return 'footer'
  if (el.closest('[data-sticky], [class*="sticky" i]')) return 'sticky'
  if (el.closest('[data-audit-hero], [class*="hero" i]')) return 'hero'
  return 'body'
}

function labelOf(el: Element): string {
  return (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60)
}

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

  const share = target?.closest<HTMLElement>('[data-share]')
  if (share?.dataset.share) {
    trackPlatformEvent('share', { method: share.dataset.share, location: locationOf(share) })
  }
  if (target?.closest('#__replain_widget, [id*="replain"], [class*="replain"]')) {
    trackPlatformEvent('chat_open', { location: window.location.pathname })
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
  // Absolute links to our own host (CMS rich text stores them that way) are internal.
  const sameSite = host === window.location.hostname.replace(/^www\./, '')

  if (host.endsWith('calendly.com')) {
    return void trackPlatformEvent('calendly_click', { location, calendly_url: url.origin + url.pathname })
  }
  if (host === 't.me' || host === 'telegram.me') return void trackPlatformEvent('contact_click', { channel: 'telegram', location })
  if (host === 'wa.me' || host.endsWith('whatsapp.com')) return void trackPlatformEvent('contact_click', { channel: 'whatsapp', location })

  if (/\.pdf$/i.test(url.pathname) || /\/pdf$/i.test(url.pathname)) {
    return void trackPlatformEvent('file_download', { file_url: url.pathname, location })
  }

  if (!sameSite) {
    // Share buttons: attribute to `share`, not generic outbound.
    if (/(twitter\.com\/intent|x\.com\/intent|facebook\.com\/sharer|t\.me\/share|linkedin\.com\/sharing)/.test(url.href)) {
      const method = host.includes('facebook') ? 'facebook' : host.includes('linkedin') ? 'linkedin' : host === 't.me' ? 'telegram' : 'x'
      return void trackPlatformEvent('share', { method, location })
    }
    trackPlatformEvent('outbound_click', { link_domain: host, link_url: url.href.slice(0, 200), location })
    return
  }

  // Internal call-to-action (contact / services / products) — skip if already reported via data-cta.
  if (!cta && CTA_PATHS.test(url.pathname) && url.pathname !== window.location.pathname) {
    trackPlatformEvent('cta_click', {
      target: url.pathname,
      label: labelOf(a),
      zone: zoneOf(a),
      location,
    })
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
