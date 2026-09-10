import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Event } from '@/entities/event'
import { EventPage } from '@/widgets/EventPage'
import { mapEvent } from '@/shared/lib/event-mappers'
import { visibleEventConditions } from '@/shared/lib/visible-event-where'
import { mediaToAbsoluteUrl, withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { EVENT_CITIES_MAP } from '@/shared/config/eventCities'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getEvent(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'events',
    where: { and: [{ slug: { equals: slug } }, ...visibleEventConditions] },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ? mapEvent(result.docs[0]) : null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return { title: 'Not found', robots: { index: false, follow: false } }
  const seo = event.seo
  const title = seo?.seoTitle ?? event.title
  const description = seo?.seoDescription ?? event.subtitle ?? event.title
  const ogImage = mediaToAbsoluteUrl(seo?.ogImage) ?? mediaToAbsoluteUrl(event.poster ?? event.cover)
  return withPayloadPageMetadata(`/events/${slug}`, {
    title,
    description,
    alternates: { canonical: `/events/${slug}` },
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo?.ogTitle ?? title,
      description: seo?.ogDescription ?? description,
      url: `/events/${slug}`,
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  })
}

function buildEventSchema(event: Event) {
  const past = new Date(event.endsAt ?? event.startsAt).getTime() < Date.now()
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.startsAt,
    ...(event.endsAt ? { endDate: event.endsAt } : {}),
    eventAttendanceMode: `https://schema.org/${event.format === 'online' ? 'OnlineEventAttendanceMode' : 'OfflineEventAttendanceMode'}`,
    eventStatus: `https://schema.org/${past ? 'EventCompleted' : 'EventScheduled'}`,
    ...(event.format === 'online'
      ? { location: { '@type': 'VirtualLocation', url: event.platformUrl ?? undefined } }
      : event.city ? { location: { '@type': 'Place', name: event.venueName ?? (EVENT_CITIES_MAP.get(event.city)?.label ?? event.city), address: [event.address, EVENT_CITIES_MAP.get(event.city)?.label ?? event.city].filter(Boolean).join(', ') } } : {}),
    ...(event.cover ? { image: [event.cover.url] } : {}),
  }
}

export default async function EventSlugRoute({ params }: PageProps) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) notFound()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildEventSchema(event)) }} />
      <EventPage event={event} />
    </>
  )
}
