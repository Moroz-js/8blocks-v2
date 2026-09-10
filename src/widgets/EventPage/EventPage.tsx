import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, Download, ExternalLink, Globe2, Instagram, Mail, MapPin, Play, UserRound } from 'lucide-react'
import type { Event, EventBadge, EventOrganizer, EventPerson } from '@/entities/event'
import { lang } from '@/shared/i18n'
import { EVENT_CITIES_MAP } from '@/shared/config/eventCities'
import { eventsContent } from '@/shared/content/eventsPage'
import { EVENT_PLACEHOLDER_IMAGE } from '@/shared/config/events'
import { RichText } from '@/shared/render/RichText'
import styles from './EventPage.module.scss'

const badgeLabels: Record<EventBadge, string> = {
  speaker: eventsContent.speaker,
  host: eventsContent.host,
  cohost: eventsContent.cohost,
}

function isPast(event: Event) {
  return new Date(event.endsAt ?? event.startsAt).getTime() < Date.now()
}

function formatDate(event: Event) {
  const locale = lang === 'ru' ? 'ru-RU' : 'en-US'
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', timeZone: event.timezone }
  try {
    const date = new Intl.DateTimeFormat(locale, options).format(new Date(event.startsAt))
    const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: event.timezone }).format(new Date(event.startsAt))
    const end = event.endsAt
      ? new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: event.timezone }).format(new Date(event.endsAt))
      : null
    return { date, time: `${time}${end ? ` – ${end}` : ''}` }
  } catch {
    return { date: new Date(event.startsAt).toLocaleDateString(locale), time: '' }
  }
}

function EventBadges({ badges }: { badges: EventBadge[] }) {
  if (!badges.length) return null
  return <div className={styles.badges}>{badges.map((badge) => <span key={badge}>{badgeLabels[badge]}</span>)}</div>
}

function ExternalSlot({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return <a href={href} className={styles.actionSlot} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{icon}<span>{label}</span><ExternalLink size={14} /></a>
}

function OrganizerRow({ organizer }: { organizer: EventOrganizer }) {
  return (
    <div className={styles.organizerRow}>
      {organizer.logo ? <Image src={organizer.logo.url} alt={organizer.logo.alt} width={32} height={32} /> : <span className={styles.organizerFallback}><UserRound size={16} /></span>}
      <span>{organizer.name}</span>
      {organizer.links.length > 0 && <span className={styles.organizerLinks}>{organizer.links.map((link) => <a href={link.href} key={link.id} target="_blank" rel="noreferrer"><ExternalLink size={13} /></a>)}</span>}
    </div>
  )
}

const socialImageIcons: Record<string, string> = {
  linkedIn: '/icons/ln-icon.svg',
  telegram: '/icons/tg-icon.svg',
  x: '/icons/x-icon.svg',
}

function PersonSocialIcon({ id }: { id: string }) {
  const src = socialImageIcons[id]
  if (src) return <Image src={src} alt="" width={32} height={32} aria-hidden />
  if (id === 'instagram') return <Instagram size={32} aria-hidden />
  if (id === 'email') return <Mail size={32} aria-hidden />
  return <Globe2 size={32} aria-hidden />
}

function Representative({ person }: { person: EventPerson }) {
  const body = (
    <>
      <Image src={person.photo?.url ?? EVENT_PLACEHOLDER_IMAGE} alt={person.name} width={120} height={120} className={styles.personPhoto} />
      <div className={styles.personContent}>
        <div className={styles.personHeading}>
          {person.showProfile && person.slug ? <Link href={`/team/${person.slug}`}>{person.name}</Link> : <h3>{person.name}</h3>}
        </div>
        {(person.bioOverride ?? person.bio) && <p>{person.bioOverride ?? person.bio}</p>}
        {person.socialLinks.length > 0 && <div className={styles.personLinks}>{person.socialLinks.map((link) => <a key={link.id} href={link.href} aria-label={link.id} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}><PersonSocialIcon id={link.id} /></a>)}</div>}
      </div>
    </>
  )
  return <article className={styles.person}>{body}</article>
}

export function EventPage({ event }: { event: Event }) {
  const past = isPast(event)
  const text = past && event.summary ? event.summary : event.content
  const textTitle = past && event.summary ? eventsContent.summary : eventsContent.about
  const date = formatDate(event)
  const recording = event.recordingFile?.url ?? event.recordingUrl
  const presentation = event.presentation?.url ?? event.presentationUrl
  const onlinePlatform = event.platform === 'other' ? event.platformLabel : event.platform?.toUpperCase()

  return (
    <section className={styles.root}>
      <aside className={styles.aside}>
        <Image src={event.poster?.url ?? event.cover?.url ?? EVENT_PLACEHOLDER_IMAGE} alt={event.title} width={320} height={320} className={styles.poster} priority />
        {event.mainOrganizer && <section className={`${styles.organizerSection} ${styles.mainOrganizer}`}><p>{eventsContent.mainOrganizer}</p><div><OrganizerRow organizer={event.mainOrganizer} /></div></section>}
        {event.organizers.length > 0 && <section className={styles.organizerSection}><p>{eventsContent.organizers}</p><div>{event.organizers.map((organizer) => <OrganizerRow key={organizer.id} organizer={organizer} />)}</div></section>}
      </aside>
      <div className={styles.main}>
        <div className={styles.eventHeading}>
          <h1>{event.title}</h1>
          <EventBadges badges={event.badges} />
        </div>
        <div className={`${styles.metaGrid} ${past && event.format === 'online' ? styles.metaGridOnlinePast : ''}`}>
          <div className={styles.infoSlot}><CalendarDays size={22} /><span><strong>{date.date}</strong><small>{date.time}</small></span></div>
          {event.format === 'offline' && event.city && <a className={styles.infoSlot} href="#location"><MapPin size={22} /><span><strong>{event.venueName ?? (EVENT_CITIES_MAP.get(event.city)?.label ?? event.city)}</strong><small>{EVENT_CITIES_MAP.get(event.city)?.label ?? event.city}</small></span></a>}
          {event.format === 'online' && onlinePlatform && <a className={styles.infoSlot} href={event.platformUrl ?? '#'} target={event.platformUrl ? '_blank' : undefined} rel="noreferrer"><Globe2 size={22} /><span><strong>{onlinePlatform}</strong><small>{event.hostName ? `Host: ${event.hostName}` : ''}</small></span></a>}
          {!past && event.format === 'offline' && event.eventUrl && <ExternalSlot href={event.eventUrl} label={eventsContent.openEventSite} icon={<Globe2 size={22} />} />}
          {!past && event.format === 'online' && <ExternalSlot href={`/events/${event.slug}/calendar.ics`} label={eventsContent.addToCalendar} icon={<CalendarDays size={22} />} />}
          {past && recording && <ExternalSlot href={recording} label={eventsContent.recording} icon={<Play size={22} />} />}
          {past && presentation && <ExternalSlot href={presentation} label={eventsContent.presentation} icon={<Download size={22} />} />}
        </div>

        {event.representatives.length > 0 && <section className={styles.representatives}><p className={styles.sectionLabel}>{eventsContent.representative}</p><div>{event.representatives.map((person) => <Representative key={person.id} person={person} />)}</div></section>}

        {Boolean(text) && typeof text === 'object' && <section className={styles.textSection}>
          <p className={styles.sectionLabel}>{textTitle}</p>
          {event.contentTitle && <h2>{event.contentTitle}</h2>}
          <RichText content={text} />
          {past && event.recapMedia && <Image className={styles.recap} src={event.recapMedia.url} alt={event.title} width={960} height={540} />}
          {event.gallery.length > 0 && <div className={styles.gallery}>{event.gallery.map((photo) => <Image key={photo.id} src={photo.url} alt={photo.alt || event.title} width={480} height={320} />)}</div>}
        </section>}

        {event.format === 'offline' && (event.venueName || event.address || event.mapsEmbedUrl || event.mapsUrl) && <section className={styles.location} id="location">
          <p className={styles.sectionLabel}>{eventsContent.location}</p>
          {event.venueName && <h2>{event.venueName}</h2>}
          {event.address && <p>{event.address}</p>}
          {event.mapsEmbedUrl ? <iframe src={event.mapsEmbedUrl} title={event.venueName ?? eventsContent.location} loading="lazy" /> : event.mapsUrl ? <ExternalSlot href={event.mapsUrl} label={eventsContent.openMap} icon={<MapPin size={20} />} /> : null}
        </section>}
      </div>
    </section>
  )
}
