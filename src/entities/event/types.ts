export type EventFormat = 'offline' | 'online'
export type EventTiming = 'upcoming' | 'past'
export type EventBadge = 'speaker' | 'host' | 'cohost'

export interface EventMedia {
  id: string
  url: string
  alt: string
  mimeType?: string | null
}

export interface EventCity {
  id: string
  name: string
  slug: string
  country?: string | null
  countryCode?: string | null
}

export interface EventPerson {
  id: string
  name: string
  slug?: string | null
  showProfile?: boolean
  photo?: EventMedia | null
  bio?: string | null
  bioOverride?: string | null
  socialLinks: { id: string; href: string }[]
  badges: EventBadge[]
}

export interface EventOrganizer {
  id: string
  name: string
  logo?: EventMedia | null
  links: { id: string; href: string }[]
}

export interface EventCard {
  id: string
  title: string
  slug: string
  subtitle?: string | null
  cover?: EventMedia | null
  featured: boolean
  format: EventFormat
  startsAt: string
  endsAt?: string | null
  timezone: string
  city?: EventCity | null
  venueName?: string | null
  mapsUrl?: string | null
  platform?: string | null
  platformLabel?: string | null
  platformUrl?: string | null
  hostName?: string | null
  recordingUrl?: string | null
  recordingFile?: EventMedia | null
  badges: EventBadge[]
  gallery: EventMedia[]
}

export interface Event extends EventCard {
  poster?: EventMedia | null
  contentTitle?: string | null
  content: unknown
  summary?: unknown
  recapMedia?: EventMedia | null
  address?: string | null
  mapsEmbedUrl?: string | null
  eventUrl?: string | null
  presentationUrl?: string | null
  presentation?: EventMedia | null
  representatives: EventPerson[]
  mainOrganizer?: EventOrganizer | null
  organizers: EventOrganizer[]
  seo?: {
    seoTitle?: string | null
    seoDescription?: string | null
    ogTitle?: string | null
    ogDescription?: string | null
    noindex?: boolean | null
    ogImage?: EventMedia | null
  } | null
  updatedAt: string
}
