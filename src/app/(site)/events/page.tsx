import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { EventCard, EventFormat, EventTiming } from '@/entities/event'
import { EventsPage } from '@/widgets/EventsPage'
import { eventsContent, eventsMeta } from '@/shared/content/eventsPage'
import { mapEventCard } from '@/shared/lib/event-mappers'
import { visibleEventWhere } from '@/shared/lib/visible-event-where'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { buildPageGraph, itemListNode } from '@/shared/lib/page-schema'
import { getEventsEnabled } from '@/shared/lib/getEventsEnabled'
import { siteConfig } from '@/shared/config/site'

export const revalidate = 60

interface PageProps {
  searchParams: Promise<{ when?: string; format?: string; city?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  // An empty hub is thin content: keep it out of the index until the first event is published.
  const hasEvents = await getEventsEnabled()
  return withPayloadPageMetadata('/events', {
    title: eventsMeta.title,
    description: eventsMeta.description,
    alternates: { canonical: '/events' },
    ...(hasEvents ? {} : { robots: { index: false, follow: true } }),
    openGraph: { title: eventsMeta.ogTitle, description: eventsMeta.ogDescription, url: '/events' },
  })
}

export default async function EventsRoute({ searchParams }: PageProps) {
  const params = await searchParams
  const timing: EventTiming = params.when === 'past' ? 'past' : 'upcoming'
  const format: EventFormat = params.format === 'online' ? 'online' : 'offline'
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'events',
    where: visibleEventWhere,
    limit: 1000,
    sort: 'startsAt',
    depth: 2,
  })
  const events = result.docs.map(mapEventCard).filter((event): event is EventCard => event !== null)
  const base = siteConfig.url.replace(/\/$/, '')
  const jsonLd = buildPageGraph({
    path: '/events',
    name: eventsContent.title,
    description: eventsMeta.description,
    pageType: 'CollectionPage',
    crumbs: [{ name: eventsContent.title, path: '/events' }],
    extra: events.length
      ? [itemListNode('/events', eventsContent.title, events.map((e) => ({ name: e.title, url: `${base}/events/${e.slug}`, description: e.subtitle ?? null, itemType: 'Event', datePublished: e.startsAt })))]
      : [],
  })
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EventsPage events={events} timing={timing} format={format} city={params.city} />
    </>
  )
}
