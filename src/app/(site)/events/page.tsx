import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { EventCard, EventFormat, EventTiming } from '@/entities/event'
import { EventsPage } from '@/widgets/EventsPage'
import { eventsMeta } from '@/shared/content/eventsPage'
import { mapEventCard } from '@/shared/lib/event-mappers'
import { visibleEventWhere } from '@/shared/lib/visible-event-where'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'

export const revalidate = 60

interface PageProps {
  searchParams: Promise<{ when?: string; format?: string; city?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/events', {
    title: eventsMeta.title,
    description: eventsMeta.description,
    alternates: { canonical: '/events' },
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
  return <EventsPage events={events} timing={timing} format={format} city={params.city} />
}
