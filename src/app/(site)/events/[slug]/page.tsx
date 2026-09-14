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
import { ORG_ID, organizationNode, websiteNode } from '@/shared/lib/content-schema'
import { breadcrumbListNode } from '@/shared/lib/page-schema'
import { siteConfig } from '@/shared/config/site'
import { lang } from '@/shared/i18n'

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
      type: 'article',
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  })
}

function buildEventSchema(event: Event) {
  const base = siteConfig.url.replace(/\/$/, '')
  const url = `${base}/events/${event.slug}`
  const past = new Date(event.endsAt ?? event.startsAt).getTime() < Date.now()
  const cityLabel = event.city ? (EVENT_CITIES_MAP.get(event.city)?.label ?? event.city) : null
  const description = event.seo?.seoDescription ?? event.subtitle ?? undefined

  const organizerNode = (o: { name: string; links: { href: string }[] }) => ({
    '@type': 'Organization',
    name: o.name,
    ...(o.links[0]?.href ? { url: o.links[0].href } : {}),
  })
  const organizers = [
    ...(event.mainOrganizer ? [organizerNode(event.mainOrganizer)] : []),
    ...event.organizers.filter((o) => o.id !== event.mainOrganizer?.id).map(organizerNode),
  ]
  const performers = event.representatives.map((p) => ({
    '@type': 'Person',
    name: p.name,
    ...(p.socialLinks[0]?.href ? { sameAs: p.socialLinks.map((l) => l.href) } : {}),
    ...(p.photo?.url ? { image: p.photo.url } : {}),
    worksFor: { '@id': ORG_ID },
  }))

  const location =
    event.format === 'online'
      ? { '@type': 'VirtualLocation', url: event.platformUrl ?? event.eventUrl ?? url }
      : cityLabel
        ? {
            '@type': 'Place',
            name: event.venueName ?? cityLabel,
            address: { '@type': 'PostalAddress', ...(event.address ? { streetAddress: event.address } : {}), addressLocality: cityLabel },
          }
        : undefined

  const eventNode = {
    '@type': 'Event',
    '@id': `${url}#event`,
    name: event.title,
    ...(description ? { description } : {}),
    url,
    startDate: event.startsAt,
    ...(event.endsAt ? { endDate: event.endsAt } : {}),
    eventAttendanceMode: `https://schema.org/${event.format === 'online' ? 'OnlineEventAttendanceMode' : 'OfflineEventAttendanceMode'}`,
    eventStatus: `https://schema.org/${past ? 'EventCompleted' : 'EventScheduled'}`,
    ...(location ? { location } : {}),
    ...(event.cover || event.poster ? { image: [event.poster?.url, event.cover?.url].filter(Boolean) } : {}),
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: event.eventUrl ?? url, validFrom: event.updatedAt },
    ...(organizers.length ? { organizer: organizers.length === 1 ? organizers[0] : organizers } : { organizer: { '@id': ORG_ID } }),
    ...(performers.length ? { performer: performers } : {}),
    ...(event.recordingUrl ? { recordedIn: { '@type': 'VideoObject', name: event.title, url: event.recordingUrl } } : {}),
    inLanguage: lang,
  }

  const webpage = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: event.title,
    ...(description ? { description } : {}),
    isPartOf: { '@id': `${base}/#website` },
    breadcrumb: { '@id': `${url}#breadcrumb` },
    mainEntity: { '@id': `${url}#event` },
    inLanguage: lang,
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      eventNode,
      webpage,
      breadcrumbListNode(`/events/${event.slug}`, [{ name: lang === 'ru' ? 'События' : 'Events', path: '/events' }, { name: event.title, path: `/events/${event.slug}` }]),
      organizationNode(),
      websiteNode(),
    ],
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
