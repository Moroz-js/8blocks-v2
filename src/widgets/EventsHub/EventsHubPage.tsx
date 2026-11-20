import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { EventCard as EventCardModel } from '@/entities/event'
import { AccentSurface, Button, Section } from '@/shared/ds'
import { socialLinks } from '@/shared/config/site'
import { COUNTRY_POINTS } from '@/shared/config/countryPoints'
import { eventsHubContent as hub, pastEventsStrings } from '@/shared/content/eventsPage'
import { BinaryGlyph } from '@/widgets/BinaryArt/BinaryGlyph'
import { ServiceHero } from '@/widgets/ServicePages/blocks/ServiceHero'
import { ChevronIcon, FormatTag } from './EventCard'
import { buildMapPins, toEventCardData, type EventCardData } from './model'
import { PastEvents } from './PastEvents'
import styles from './EventsHubPage.module.scss'

const HIGHLIGHT_ROWS = [
  [
    { file: '01', width: 440 },
    { file: '02', width: 480 },
    { file: '03', width: 280 },
    { file: '04', width: 440 },
    { file: '05', width: 280 },
  ],
  [
    { file: '07', width: 300 },
    { file: '08', width: 520 },
    { file: '11', width: 300 },
    { file: '12', width: 520 },
  ],
]

function FeaturedEvent({ event }: { event: EventCardData }) {
  return (
    <article className={styles.featured}>
      <Link href={event.href} className={styles.featuredCover} tabIndex={-1} aria-hidden="true">
        {event.cover && <Image src={event.cover.url} alt="" fill sizes="(max-width: 1024px) 100vw, 560px" className={styles.featuredImage} />}
        <FormatTag format={event.format} label={event.formatLabel} className={styles.featuredTag} />
      </Link>
      <div className={styles.featuredBody}>
        <p className={styles.featuredMeta}>{[event.when, event.where].filter(Boolean).join(' · ')}</p>
        <h3 className={styles.featuredTitle}>
          <Link href={event.href}>{event.title}</Link>
        </h3>
        {event.excerpt && <p className={styles.featuredExcerpt}>{event.excerpt}</p>}
        <div className={styles.actions}>
          <Button href="/contact">{hub.requestMeeting}</Button>
          <Button href={event.href} variant="tertiary" icon={<ChevronIcon />}>
            {hub.eventDetails}
          </Button>
        </div>
      </div>
    </article>
  )
}

function EmptyUpcoming() {
  const channels = socialLinks.filter((link) => link.id === 'x' || link.id === 'telegram')
  return (
    <div className={styles.empty}>
      <AccentSurface />
      <BinaryGlyph shape="clock" ox={0.78} oy={0.5} os={0.9} className={styles.emptyGlyph} />
      <div className={styles.emptyText}>
        <h3 className={styles.emptyTitle}>{hub.emptyTitle}</h3>
        <p>{hub.emptyText}</p>
      </div>
      <div className={styles.actions}>
        <Button href="/contact">{hub.requestMeeting}</Button>
        {channels.map((link) => (
          <Button key={link.id} href={link.href} variant="tertiary" target="_blank" rel="noopener noreferrer">
            {link.id === 'x' ? hub.followX : hub.telegram}
          </Button>
        ))}
      </div>
    </div>
  )
}

interface EventsHubPageProps {
  /** Soonest first. */
  upcoming: readonly EventCardModel[]
  /** Latest first. */
  past: readonly EventCardModel[]
}

/** /events: globe hero, upcoming events, the past-events map and grid, photo highlights. */
export function EventsHubPage({ upcoming, past }: EventsHubPageProps) {
  const pastCards = past.map(toEventCardData)
  return (
    <>
      <ServiceHero
        scene="globe"
        glow={false}
        artTop={52}
        artLeft={164}
        artScale={0.85}
        artCenterX={861}
        title={hub.heroTitle}
        description={hub.heroText}
      >
        <Button href="/contact">{hub.requestMeeting}</Button>
      </ServiceHero>

      <Section title={hub.upcomingTitle} id="upcoming">
        {upcoming.length > 0 ? (
          <div className={styles.featuredList}>
            {upcoming.map((event) => (
              <FeaturedEvent key={event.id} event={toEventCardData(event)} />
            ))}
          </div>
        ) : (
          <EmptyUpcoming />
        )}
      </Section>

      {pastCards.length > 0 && (
        <Section title={hub.pastTitle} id="past">
          <PastEvents
            events={pastCards}
            pins={buildMapPins(pastCards, COUNTRY_POINTS)}
            strings={pastEventsStrings}
            detailsLabel={hub.eventDetails}
          />
        </Section>
      )}

      <Section title={hub.highlightsTitle} description={hub.highlightsText}>
        <div className={styles.strip}>
          {HIGHLIGHT_ROWS.map((row, i) => (
            <div key={i} className={styles.row}>
              {row.map((tile) => (
                <span key={tile.file} className={styles.tile} style={{ '--w': tile.width } as CSSProperties}>
                  <Image src={`/img/events/highlight-${tile.file}.webp`} alt={hub.highlightAlt} fill sizes={`${tile.width}px`} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
