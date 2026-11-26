import type { EventCard, EventFormat } from '@/entities/event'
import { lang } from '@/shared/i18n'
import { countryPhoto, eventCover } from './eventArtwork'
import { EVENT_CITIES_MAP, eventCityLabel } from '@/shared/config/eventCities'
import { eventsContent, eventsHubContent } from '@/shared/content/eventsPage'

/** Card data prepared on the server: the client block gets display strings only. */
export interface EventCardData {
  id: string
  href: string
  title: string
  excerpt: string | null
  cover: { url: string; alt: string } | null
  format: EventFormat
  formatLabel: string
  when: string
  where: string
  /** ISO country of an offline event (map pins and the country filter). */
  country: string | null
  recordingUrl: string | null
  recordingLabel: string
}

const locale = lang === 'ru' ? 'ru-RU' : 'en-US'

const PLATFORM_LABELS: Record<string, string> = { youtube: 'YouTube', x: 'X Space', zoom: 'Zoom' }

export function isPastEvent(event: Pick<EventCard, 'startsAt' | 'endsAt'>, now = Date.now()) {
  return new Date(event.endsAt ?? event.startsAt).getTime() < now
}

function dateRange(event: EventCard, month: 'short' | 'long') {
  const format = new Intl.DateTimeFormat(locale, { day: 'numeric', month, year: 'numeric', timeZone: event.timezone })
  const start = new Date(event.startsAt)
  return event.endsAt ? format.formatRange(start, new Date(event.endsAt)) : format.format(start)
}

/** «Oct 7 – 8, 2026» for cards. */
export const shortDate = (event: EventCard) => dateRange(event, 'short')

/** «October 7 – 8, 2026» for the event page. */
export const longDate = (event: EventCard) => dateRange(event, 'long')

/** «18:00 – 22:00»; null for events stored without a time (midnight start). */
export function timeRange(event: EventCard) {
  const format = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: event.timezone })
  const start = format.format(new Date(event.startsAt))
  if (start === '00:00' || start === '24:00') return null
  return event.endsAt ? `${start} – ${format.format(new Date(event.endsAt))}` : start
}

export function eventCountry(event: Pick<EventCard, 'format' | 'city'>) {
  if (event.format !== 'offline' || !event.city) return null
  return EVENT_CITIES_MAP.get(event.city)?.countryCode ?? null
}

const regionNames = new Intl.DisplayNames([locale], { type: 'region' })

export function countryName(code: string) {
  return regionNames.of(code) ?? code
}

/** Online: the platform; offline: city, plus the country when it differs («Seoul, South Korea»). */
export function eventWhere(event: EventCard) {
  if (event.format === 'online') {
    return (event.platform && PLATFORM_LABELS[event.platform]) || event.platformLabel || eventsContent.online
  }
  const city = eventCityLabel(event.city)
  const country = eventCountry(event)
  const name = country ? countryName(country) : ''
  if (!city) return name || event.venueName || ''
  return name && name !== city ? `${city}, ${name}` : city
}

export interface MapPin {
  country: string
  name: string
  /** Point and thumbnail centre in the 1200 × 545 map frame. */
  x: number
  y: number
  thumbX: number
  cover: { url: string; alt: string } | null
}

export const MAP_WIDTH = 1200
export const MAP_HEIGHT = 545
const THUMB_W = 114
const THUMB_H = 96

/** Equirectangular map art: fitted on the designer's pins (Dortmund, Barcelona, Seoul, Singapore). */
const project = (lat: number, lon: number) => ({ x: 567 + 3.33 * lon, y: 348.5 - 3.33 * lat })

/** One pin per country of the past offline events; thumbnails that would overlap are pushed apart. */
export function buildMapPins(events: readonly EventCardData[], points: Record<string, readonly [number, number]>) {
  const pins: MapPin[] = []
  for (const event of events) {
    const point = event.country ? points[event.country] : undefined
    if (!event.country || !point) continue
    const existing = pins.find((pin) => pin.country === event.country)
    if (existing) {
      existing.cover ??= event.cover
      continue
    }
    const { x, y } = project(point[0], point[1])
    pins.push({ country: event.country, name: countryName(event.country), x, y, thumbX: x, cover: countryPhoto(event.country) ?? event.cover })
  }
  pins.sort((a, b) => a.x - b.x)
  pins.forEach((pin, i) => {
    for (const other of pins.slice(0, i)) {
      if (Math.abs(other.y - pin.y) < THUMB_H && pin.thumbX - other.thumbX < THUMB_W) pin.thumbX = other.thumbX + THUMB_W
    }
    pin.thumbX = Math.min(pin.thumbX, MAP_WIDTH - THUMB_W / 2)
  })
  return pins
}

export function toEventCardData(event: EventCard): EventCardData {
  return {
    id: event.id,
    href: `/events/${event.slug}`,
    title: event.title,
    excerpt: event.subtitle ?? null,
    cover: eventCover(event),
    format: event.format,
    formatLabel: event.format === 'online' ? eventsContent.online : eventsContent.offline,
    when: shortDate(event),
    where: eventWhere(event),
    country: eventCountry(event),
    recordingUrl: event.recordingUrl ?? event.recordingFile?.url ?? null,
    recordingLabel: event.platform === 'x' ? eventsHubContent.listenSpace : eventsContent.watchRecording,
  }
}
