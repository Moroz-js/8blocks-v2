import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import type { EventFormat } from '@/entities/event'
import type { EventCardData } from './model'
import styles from './EventCard.module.scss'

export const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect x="1.5" y="2.5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M1.5 5.5h11M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

export const PinIcon = () => (
  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
    <path d="M6 13s4.8-4.2 4.8-7.6A4.8 4.8 0 0 0 1.2 5.4C1.2 8.8 6 13 6 13Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="6" cy="5.4" r="1.6" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

export const ChevronIcon = ({ back = false }: { back?: boolean }) => (
  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true">
    <path d={back ? 'M5 1L1 5l4 4' : 'M1 1l4 4-4 4'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** «● Offline» tag on a cover: white dot offline, pink dot online. */
export function FormatTag({ format, label, className }: { format: EventFormat; label: string; className?: string }) {
  return (
    <span className={clsx(styles.tag, className)}>
      <span className={clsx(styles.dot, format === 'online' && styles.dotOnline)} aria-hidden="true" />
      {label}
    </span>
  )
}

interface EventCardProps {
  event: EventCardData
  detailsLabel: string
  className?: string
}

/** Event card: 16:9 cover with the format tag, date and place, title, actions. */
export function EventCard({ event, detailsLabel, className }: EventCardProps) {
  return (
    <article className={clsx(styles.card, className)}>
      <Link href={event.href} className={styles.cover} tabIndex={-1} aria-hidden="true">
        {event.cover && (
          <Image
            src={event.cover.url}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className={styles.image}
          />
        )}
        <FormatTag format={event.format} label={event.formatLabel} className={styles.coverTag} />
      </Link>
      <div className={styles.body}>
        <p className={styles.when}>
          <span className={styles.date}>
            <CalendarIcon />
            {event.when}
          </span>
          {event.where && (
            <span className={styles.where}>
              <PinIcon />
              {event.where}
            </span>
          )}
        </p>
        <h3 className={styles.title}>
          <Link href={event.href}>{event.title}</Link>
        </h3>
        {event.excerpt && <p className={styles.excerpt}>{event.excerpt}</p>}
        <div className={styles.actions}>
          {event.recordingUrl && (
            <a href={event.recordingUrl} target="_blank" rel="noopener noreferrer" className={clsx(styles.pill, styles.pillPrimary)}>
              {event.recordingLabel}
            </a>
          )}
          <Link href={event.href} className={styles.pill}>
            {detailsLabel}
            <ChevronIcon />
          </Link>
        </div>
      </div>
    </article>
  )
}
