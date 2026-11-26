import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import type { Event, EventCard as EventCardModel, EventOrganizer } from '@/entities/event'
import { Button, Section } from '@/shared/ds'
import { eventCityLabel } from '@/shared/config/eventCities'
import { eventsContent, eventsHubContent as hub } from '@/shared/content/eventsPage'
import { lang } from '@/shared/i18n'
import { RichText } from '@/shared/render'
import { ArticleRoot } from '@/widgets/ArticlePage/ArticleParts'
import { ChevronIcon, EventCard } from './EventCard'
import { eventCover } from './eventArtwork'
import { eventWhere, isPastEvent, timeRange, toEventCardData } from './model'
import cardStyles from './EventCard.module.scss'
import styles from './EventDetailPage.module.scss'

interface Fact {
  label: string
  value: string
  href?: string | null
}

const ROLE_LABELS = { speaker: eventsContent.speaker, host: eventsContent.host, cohost: eventsContent.cohost }

function fullDate(event: Event) {
  const multiDay = Boolean(event.endsAt) && new Date(event.endsAt!).toDateString() !== new Date(event.startsAt).toDateString()
  const format = new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-US', {
    ...(multiDay ? {} : { weekday: 'long' as const }),
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: event.timezone,
  })
  return event.endsAt ? format.formatRange(new Date(event.startsAt), new Date(event.endsAt)) : format.format(new Date(event.startsAt))
}

function location(event: Event) {
  if (event.format === 'online') return eventWhere(event)
  const city = eventCityLabel(event.city)
  if (!event.venueName) return eventWhere(event)
  return city && !event.venueName.includes(city) ? `${event.venueName}, ${city}` : event.venueName
}

function organizersSummary(event: Event) {
  const all = [event.mainOrganizer, ...event.organizers].filter((item): item is EventOrganizer => Boolean(item))
  if (!all.length) return null
  if (all.length === 1) return all[0].name
  return hub.andMore.replace('{name}', all[0].name).replace('{n}', String(all.length - 1))
}

function OrganizerChips({ title, items }: { title: string; items: EventOrganizer[] }) {
  return (
    <div className={styles.partnerBox}>
      <p className={styles.partnerTitle}>{title}</p>
      <ul className={styles.chips}>
        {items.map((item) => {
          const href = item.links.find((link) => link.id === 'website')?.href ?? item.links[0]?.href
          return (
            <li key={item.id}>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className={styles.chip}>
                  {item.name}
                </a>
              ) : (
                <span className={styles.chip}>{item.name}</span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

interface EventDetailPageProps {
  event: Event
  /** Other events for the «More events» row. */
  more: readonly EventCardModel[]
}

/** /events/[slug]: centred header, cover with the facts grid, the story, team, partners, photos. */
export function EventDetailPage({ event, more }: EventDetailPageProps) {
  const past = isPastEvent(event)
  const cover = event.poster ?? eventCover(event)
  const role = event.badges[0]
  const time = timeRange(event)
  const formatLabel = event.format === 'online' ? eventsContent.online : eventsContent.offline
  const organizers = organizersSummary(event)
  const recordingUrl = event.recordingUrl ?? event.recordingFile?.url ?? null
  const presentationUrl = event.presentationUrl ?? event.presentation?.url ?? null
  const gallery = event.recapMedia ? [event.recapMedia, ...event.gallery] : event.gallery

  const facts = ([
    { label: hub.date, value: fullDate(event) },
    time && { label: hub.time, value: `${time}, ${event.timezone === 'UTC' ? 'UTC' : hub.localTime}` },
    { label: hub.location, value: location(event), href: event.format === 'offline' ? event.mapsUrl : event.platformUrl },
    { label: hub.format, value: formatLabel },
    role && { label: hub.ourRole, value: ROLE_LABELS[role] },
    organizers && { label: hub.organizers, value: organizers },
  ] as (Fact | false | null | '')[]).filter((fact): fact is Fact => Boolean(fact && fact.value))

  const meta = [fullDate(event), eventWhere(event), role && `${hub.ofCompany}: ${ROLE_LABELS[role].toLowerCase()}`].filter(Boolean)

  return (
    <ArticleRoot>
      <div className={styles.top}>
        <Link href="/events" className={cardStyles.pill}>
          <ChevronIcon back />
          {hub.allEvents}
        </Link>
      </div>

      <header className={styles.header}>
        <p className={styles.eyebrow}>
          {past ? hub.pastEvent : hub.upcomingEvent} · {formatLabel}
        </p>
        <h1 className={styles.title}>{event.title}</h1>
        <p className={styles.meta}>{meta.join(' · ')}</p>
      </header>

      <div className={styles.column}>
        {cover && (
          <div className={styles.cover}>
            <Image
              src={cover.url}
              alt={cover.alt || event.title}
              fill
              priority
              sizes="(max-width: 840px) 100vw, 774px"
              className={styles.coverImage}
            />
          </div>
        )}
        <dl className={clsx(styles.facts, !cover && styles.factsAlone)}>
          {facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt>{fact.label}</dt>
              <dd>
                {fact.href ? (
                  <a href={fact.href} target="_blank" rel="noopener noreferrer">
                    {fact.value}
                  </a>
                ) : (
                  fact.value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className={styles.actions}>
          <Button href="/contact">{hub.requestMeeting}</Button>
          {past && recordingUrl && (
            <Button href={recordingUrl} variant="secondary" target="_blank" rel="noopener noreferrer">
              {event.platform === 'x' ? hub.listenSpace : eventsContent.watchRecording}
            </Button>
          )}
          {!past && event.eventUrl && (
            <Button href={event.eventUrl} variant="secondary" target="_blank" rel="noopener noreferrer">
              {hub.eventWebsite}
            </Button>
          )}
          {!past && (
            <Button href={`/events/${event.slug}/calendar.ics`} variant="secondary" prefetch={false} download>
              {eventsContent.addToCalendar}
            </Button>
          )}
          {presentationUrl && (
            <Button href={presentationUrl} variant="secondary" target="_blank" rel="noopener noreferrer">
              {eventsContent.presentation}
            </Button>
          )}
        </div>

        <div className={styles.body}>
          {event.subtitle && <p className={styles.lead}>{event.subtitle}</p>}

          {Boolean(event.content) && (
            <section className={styles.story}>
              {event.contentTitle && <h2>{event.contentTitle}</h2>}
              <RichText content={event.content} />
            </section>
          )}

          {event.representatives.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{hub.team}</h2>
              <ul className={styles.team}>
                {event.representatives.map((person) => {
                  const linkedIn = person.socialLinks.find((link) => link.id === 'linkedIn')
                  const bio = person.bioOverride ?? person.bio
                  return (
                    <li key={person.id} className={styles.person}>
                      {person.photo ? (
                        <Image src={person.photo.url} alt={person.name} width={48} height={48} className={styles.personPhoto} />
                      ) : (
                        <span className={styles.personPhoto} aria-hidden="true" />
                      )}
                      <div className={styles.personBody}>
                        <p className={styles.personName}>
                          {person.showProfile && person.slug ? <Link href={`/team/${person.slug}`}>{person.name}</Link> : person.name}
                          {person.position && <span className={styles.personRole}> · {person.position}</span>}
                        </p>
                        {bio && <p className={styles.personBio}>{bio}</p>}
                        {linkedIn && (
                          <a href={linkedIn.href} target="_blank" rel="noopener noreferrer" className={styles.personLink}>
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          {(event.mainOrganizer || event.organizers.length > 0) && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{hub.partners}</h2>
              <div className={styles.partners}>
                {event.mainOrganizer && <OrganizerChips title={hub.mainOrganizer} items={[event.mainOrganizer]} />}
                {event.organizers.length > 0 && (
                  <OrganizerChips title={event.mainOrganizer ? hub.coOrganizers : eventsContent.organizers} items={event.organizers} />
                )}
              </div>
            </section>
          )}

          {Boolean(event.summary) && (
            <section className={styles.story}>
              <h2>{eventsContent.summary}</h2>
              <RichText content={event.summary} />
            </section>
          )}

          {gallery.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{hub.highlights}</h2>
              <div className={styles.gallery}>
                {gallery.map((photo) => (
                  <span key={photo.id} className={styles.photo}>
                    {photo.mimeType?.startsWith('video/') ? (
                      <video src={photo.url} controls preload="metadata" />
                    ) : (
                      <Image src={photo.url} alt={photo.alt || event.title} fill sizes="(max-width: 840px) 100vw, 774px" />
                    )}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {more.length > 0 && (
        <Section title={hub.moreEvents}>
          <div className={styles.more}>
            {more.map((item) => (
              <EventCard key={item.id} event={toEventCardData(item)} detailsLabel={hub.eventDetails} />
            ))}
          </div>
        </Section>
      )}
    </ArticleRoot>
  )
}
