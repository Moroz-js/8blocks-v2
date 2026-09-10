import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, Globe2, MapPin, PartyPopper, Play, UserRound } from 'lucide-react'
import type { EventBadge, EventCard, EventFormat, EventTiming } from '@/entities/event'
import { lang } from '@/shared/i18n'
import { eventsContent } from '@/shared/content/eventsPage'
import { EVENT_PLACEHOLDER_IMAGE } from '@/shared/config/events'
import { EVENT_CITIES_MAP } from '@/shared/config/eventCities'
import { ButtonLink } from '@/shared/ui'
import styles from './EventsPage.module.scss'

interface Props {
  events: EventCard[]
  timing: EventTiming
  format: EventFormat
  city?: string
  basePath?: string
  title?: string
  embedded?: boolean
}

const badgeLabels: Record<EventBadge, string> = {
  speaker: eventsContent.speaker,
  host: eventsContent.host,
  cohost: eventsContent.cohost,
}

function dateParts(iso: string, timezone: string) {
  const date = new Date(iso)
  const locale = lang === 'ru' ? 'ru-RU' : 'en-US'
  try {
    return {
      weekday: new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: timezone }).format(date),
      time: new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: timezone }).format(date),
      month: new Intl.DateTimeFormat(locale, { month: 'short', timeZone: timezone }).format(date).replace('.', ''),
      day: new Intl.DateTimeFormat(locale, { day: '2-digit', timeZone: timezone }).format(date),
      group: new Intl.DateTimeFormat(locale, { month: 'long', timeZone: timezone }).format(date),
    }
  } catch {
    return {
      weekday: date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' }),
      time: date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false }),
      month: date.toLocaleDateString(locale, { month: 'short' }).replace('.', ''),
      day: String(date.getDate()).padStart(2, '0'),
      group: date.toLocaleDateString(locale, { month: 'long' }),
    }
  }
}

function timingOf(event: EventCard): EventTiming {
  return new Date(event.endsAt ?? event.startsAt).getTime() < Date.now() ? 'past' : 'upcoming'
}

function PlatformIcon({ platform }: { platform?: string | null }) {
  return <span className={styles.platformIcon} aria-hidden>{platform === 'x' ? '𝕏' : <Globe2 size={18} />}</span>
}

function CalendarDate({ event }: { event: EventCard }) {
  const start = dateParts(event.startsAt, event.timezone)
  const end = event.endsAt ? dateParts(event.endsAt, event.timezone) : null
  return (
    <div className={styles.dateMeta}>
      <span className={styles.dateTile}><small>{start.month}</small><strong>{start.day}</strong></span>
      <span>
        <strong>{start.weekday}</strong>
        <small>{start.time}{end ? ` – ${end.time}` : ''}</small>
      </span>
    </div>
  )
}

function EventBadges({ badges }: { badges: EventBadge[] }) {
  if (!badges.length) return null
  return <div className={styles.badges}>{badges.map((badge) => <span key={badge}>{badgeLabels[badge]}</span>)}</div>
}

function GalleryStack({ gallery }: { gallery: EventCard['gallery'] }) {
  if (!gallery.length) return null
  return (
    <div className={styles.galleryStack} aria-label={`${gallery.length} photos`}>
      <div className={styles.galleryImages}>
        {gallery.slice(0, 3).map((photo) => <Image key={photo.id} src={photo.url} alt="" width={32} height={32} />)}
      </div>
      <span>+{gallery.length}</span>
    </div>
  )
}

function EventCardView({ event, timing }: { event: EventCard; timing: EventTiming }) {
  const href = `/events/${event.slug}`
  const isOffline = event.format === 'offline'
  const platformName = event.platform === 'other' ? event.platformLabel : event.platform?.toUpperCase()
  const recordingHref = event.recordingFile?.url ?? event.recordingUrl
  const endTime = event.endsAt ? dateParts(event.endsAt, event.timezone).time : null

  if (event.featured) {
    return (
      <article className={styles.featured}>
        <Image src={event.cover?.url ?? EVENT_PLACEHOLDER_IMAGE} alt={event.title} fill sizes="(max-width: 768px) 100vw, 900px" className={styles.featuredImage} />
        <div className={styles.featuredScrim} />
        <div className={styles.featuredContent}>
          <h2><Link href={href}>{event.title}</Link></h2>
          {event.subtitle && <p>{event.subtitle}</p>}
          <div className={styles.featuredMeta}>
            <CalendarDate event={event} />
            {isOffline && event.city && <span><MapPin size={16} />{event.venueName ?? (EVENT_CITIES_MAP.get(event.city)?.label ?? event.city)}</span>}
          </div>
          <Link href={href} className={styles.details}>{eventsContent.details} &gt;</Link>
        </div>
      </article>
    )
  }

  return (
    <article className={styles.card}>
      <Image src={event.cover?.url ?? EVENT_PLACEHOLDER_IMAGE} alt={event.title} width={96} height={96} className={styles.cover} />
      <div className={styles.cardBody}>
        <div className={styles.cardHeading}>
          <h2><Link href={href}>{event.title}</Link></h2>
          <EventBadges badges={event.badges} />
        </div>
        <div className={styles.eventMetaRow}>
          <CalendarDate event={event} />
          <div className={styles.locationMeta}>
            {isOffline ? <MapPin size={20} /> : <PlatformIcon platform={event.platform} />}
            <span>
              <strong>{isOffline ? event.venueName ?? (event.city ? EVENT_CITIES_MAP.get(event.city)?.label ?? event.city : '') : platformName}</strong>
              <small>{isOffline ? event.city ? EVENT_CITIES_MAP.get(event.city)?.label ?? event.city : '' : event.hostName ? `Host: ${event.hostName}` : ''}</small>
            </span>
          </div>
        </div>
        <div className={styles.cardFooter}>
          <Link href={href} className={styles.details}>{eventsContent.details} &gt;</Link>
          <div className={styles.cardActions}>
            {timing === 'upcoming' && !isOffline && endTime && <span className={styles.recordingAfter}>{eventsContent.recordingAvailableAfter(endTime)}</span>}
            {timing === 'past' && !isOffline && recordingHref && <a href={recordingHref} target={event.recordingUrl ? '_blank' : undefined} rel={event.recordingUrl ? 'noreferrer' : undefined} className={styles.details}><Play size={14} />{eventsContent.watchRecording} &gt;</a>}
            {timing === 'past' && isOffline && <GalleryStack gallery={event.gallery} />}
          </div>
        </div>
      </div>
    </article>
  )
}

export function EventsPage({ events, timing, format, city, basePath = '/events', title = eventsContent.title, embedded = false }: Props) {
  const visible = events.filter((event) => timingOf(event) === timing && event.format === format && (!city || event.city === city))
  const cities = [...new Set(events.filter((event) => timingOf(event) === timing && event.format === 'offline' && event.city).map((event) => event.city!))]
    .map((slug) => ({ slug, label: EVENT_CITIES_MAP.get(slug)?.label ?? slug, countryCode: EVENT_CITIES_MAP.get(slug)?.countryCode }))
  const ordered = [...visible].sort((a, b) => timing === 'upcoming'
    ? new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    : new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime())
  const groups = ordered.reduce<Map<string, EventCard[]>>((map, event) => {
    const key = dateParts(event.startsAt, event.timezone).group
    map.set(key, [...(map.get(key) ?? []), event])
    return map
  }, new Map())
  const link = (next: Partial<{ when: EventTiming; format: EventFormat; city: string }>) => {
    const params = new URLSearchParams({ when: next.when ?? timing, format: next.format ?? format })
    const nextCity = next.format === 'online' ? '' : next.city ?? city
    if (nextCity) params.set('city', nextCity)
    return `${basePath}?${params}`
  }

  return (
    <section className={`${styles.root} ${embedded ? styles.embedded : ''}`}>
      <div className={styles.pageHeader}>
        <h1>{title}</h1>
        <nav className={styles.formatNav} aria-label="Event format">
          <Link href={link({ format: 'offline', city: undefined })} className={format === 'offline' ? styles.formatActive : styles.formatLink}><MapPin size={16} />{eventsContent.offline}</Link>
          <Link href={link({ format: 'online', city: '' })} className={format === 'online' ? styles.formatActive : styles.formatLink}><Globe2 size={16} />{eventsContent.online}</Link>
        </nav>
      </div>
      <aside className={styles.timingNav}>
        <Link href={link({ when: 'upcoming' })} className={timing === 'upcoming' ? styles.timingActive : styles.timingLink}><CalendarDays size={20} />{eventsContent.upcoming}</Link>
        <Link href={link({ when: 'past' })} className={timing === 'past' ? styles.timingActive : styles.timingLink}><PartyPopper size={20} />{eventsContent.past}</Link>
      </aside>
      <div className={styles.main}>
        {format === 'offline' && cities.length > 0 && (
          <nav className={styles.cityNav} aria-label="Cities">
            {cities.map((eventCity) => {
              const count = events.filter((event) => timingOf(event) === timing && event.format === 'offline' && event.city === eventCity.slug).length
              const flag = eventCity.countryCode ? String.fromCodePoint(...[...eventCity.countryCode].map((char) => 127397 + char.charCodeAt(0))) : null
              return <Link key={eventCity.slug} href={link({ city: city === eventCity.slug ? '' : eventCity.slug })} className={city === eventCity.slug ? styles.cityActive : styles.cityLink}><span className={styles.cityFlag}>{flag ?? <UserRound size={14} />}</span>{eventCity.label} <em>{count}</em></Link>
            })}
          </nav>
        )}
        {groups.size ? <div className={styles.timeline}>{[...groups].map(([month, group]) => <section className={styles.month} key={month}><h2>{month}</h2><div>{group.map((event) => <EventCardView key={event.id} event={event} timing={timing} />)}</div></section>)}</div> : <p className={styles.empty}>{timing === 'upcoming' ? eventsContent.emptyUpcoming : eventsContent.emptyPast}</p>}
        {timing === 'upcoming' && <ButtonLink href={link({ when: 'past' })} variant="secondary" fullWidth>{eventsContent.viewPast}</ButtonLink>}
      </div>
    </section>
  )
}
