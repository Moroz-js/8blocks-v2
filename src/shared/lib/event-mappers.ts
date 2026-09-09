import type { Event, EventBadge, EventCard, EventCity, EventMedia, EventOrganizer, EventPerson } from '@/entities/event'

type Raw = Record<string, unknown>

function record(value: unknown): Raw | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Raw : null
}

function media(value: unknown, fallbackAlt: string): EventMedia | null {
  const item = record(value)
  if (!item || item.id === undefined) return null
  const url = typeof item.url === 'string'
    ? item.url
    : typeof item.filename === 'string'
      ? `/uploads/${item.filename}`
      : null
  if (!url) return null
  return {
    id: String(item.id),
    url,
    alt: typeof item.alt === 'string' ? item.alt : fallbackAlt,
    mimeType: typeof item.mimeType === 'string' ? item.mimeType : null,
  }
}

function linkList(item: Raw, ids: string[]) {
  return ids.flatMap((id) => typeof item[id] === 'string' ? [{ id, href: item[id] as string }] : [])
}

function city(value: unknown): EventCity | null {
  const item = record(value)
  if (!item || typeof item.name !== 'string' || typeof item.slug !== 'string') return null
  return {
    id: String(item.id),
    name: item.name,
    slug: item.slug,
    country: typeof item.country === 'string' ? item.country : null,
    countryCode: typeof item.countryCode === 'string' ? item.countryCode : null,
  }
}

function organizer(value: unknown): EventOrganizer | null {
  const item = record(value)
  if (!item || typeof item.name !== 'string') return null
  return {
    id: String(item.id),
    name: item.name,
    logo: media(item.logo, item.name),
    links: linkList(item, ['instagram', 'x', 'website']),
  }
}

function representative(value: unknown): EventPerson | null {
  const row = record(value)
  const person = record(row?.person)
  if (!row || !person || typeof person.name !== 'string') return null
  const badges: EventBadge[] = []
  if (row.isSpeaker === true) badges.push('speaker')
  if (row.hostRole === 'host' || row.hostRole === 'cohost') badges.push(row.hostRole)
  return {
    id: String(person.id),
    name: person.name,
    slug: typeof person.slug === 'string' ? person.slug : null,
    showProfile: person.showProfile === true,
    photo: media(person.photo, person.name),
    bio: typeof person.bio === 'string' ? person.bio : null,
    bioOverride: typeof row.bioOverride === 'string' ? row.bioOverride : null,
    socialLinks: linkList(person, ['instagram', 'x', 'telegram', 'linkedIn', 'website', 'email'])
      .map((link) => link.id === 'email' ? { ...link, href: `mailto:${link.href}` } : link),
    badges,
  }
}

function cardBadges(representatives: EventPerson[]): EventBadge[] {
  return [...new Set(representatives.flatMap((person) => person.badges))]
}

export function mapEventCard(value: unknown): EventCard | null {
  const item = record(value)
  if (!item || typeof item.title !== 'string' || typeof item.slug !== 'string') return null
  if (item.format !== 'offline' && item.format !== 'online') return null
  if (typeof item.startsAt !== 'string') return null
  const title = item.title
  const representatives = Array.isArray(item.representatives)
    ? item.representatives.map(representative).filter((person): person is EventPerson => person !== null)
    : []
  const gallery = Array.isArray(item.gallery)
    ? item.gallery.map((value) => media(value, title)).filter((image): image is EventMedia => image !== null)
    : []
  return {
    id: String(item.id),
    title,
    slug: item.slug,
    subtitle: typeof item.subtitle === 'string' ? item.subtitle : null,
    cover: media(item.cover, title),
    featured: item.featured === true,
    format: item.format,
    startsAt: item.startsAt,
    endsAt: typeof item.endsAt === 'string' ? item.endsAt : null,
    timezone: typeof item.timezone === 'string' ? item.timezone : 'UTC',
    city: city(item.city),
    venueName: typeof item.venueName === 'string' ? item.venueName : null,
    mapsUrl: typeof item.mapsUrl === 'string' ? item.mapsUrl : null,
    platform: typeof item.platform === 'string' ? item.platform : null,
    platformLabel: typeof item.platformLabel === 'string' ? item.platformLabel : null,
    platformUrl: typeof item.platformUrl === 'string' ? item.platformUrl : null,
    hostName: typeof item.hostName === 'string' ? item.hostName : null,
    recordingUrl: typeof item.recordingUrl === 'string' ? item.recordingUrl : null,
    recordingFile: media(item.recordingFile, `${item.title} — запись`),
    badges: cardBadges(representatives),
    gallery,
  }
}

export function mapEvent(value: unknown): Event | null {
  const item = record(value)
  const card = mapEventCard(item)
  if (!item || !card) return null
  const organizers = Array.isArray(item.organizers)
    ? item.organizers.map(organizer).filter((entry): entry is EventOrganizer => entry !== null)
    : []
  const representatives = Array.isArray(item.representatives)
    ? item.representatives.map(representative).filter((person): person is EventPerson => person !== null)
    : []
  const seo = record(item.seo)
  return {
    ...card,
    poster: media(item.poster, card.title),
    contentTitle: typeof item.contentTitle === 'string' ? item.contentTitle : null,
    content: item.content,
    summary: item.summary,
    recapMedia: media(item.recapMedia, `${card.title} — саммари`),
    address: typeof item.address === 'string' ? item.address : null,
    mapsEmbedUrl: typeof item.mapsEmbedUrl === 'string' ? item.mapsEmbedUrl : null,
    eventUrl: typeof item.eventUrl === 'string' ? item.eventUrl : null,
    presentationUrl: typeof item.presentationUrl === 'string' ? item.presentationUrl : null,
    presentation: media(item.presentation, `${card.title} — презентация`),
    representatives,
    mainOrganizer: organizer(item.mainOrganizer),
    organizers,
    seo: seo ? {
      seoTitle: typeof seo.seoTitle === 'string' ? seo.seoTitle : null,
      seoDescription: typeof seo.seoDescription === 'string' ? seo.seoDescription : null,
      ogTitle: typeof seo.ogTitle === 'string' ? seo.ogTitle : null,
      ogDescription: typeof seo.ogDescription === 'string' ? seo.ogDescription : null,
      noindex: seo.noindex === true,
      ogImage: media(seo.ogImage, card.title),
    } : null,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : card.startsAt,
  }
}
