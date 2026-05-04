import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import type { SiteSeoPageOverride } from './types'
import { mediaToAbsoluteUrl } from './media-absolute-url'

function str(v: string | null | undefined): string | undefined {
  const t = v?.trim()
  return t ? t : undefined
}

function pickTitle(fallback: Metadata): string | undefined {
  const t = fallback.title
  if (typeof t === 'string') return t
  if (t && typeof t === 'object' && 'default' in t) {
    const d = (t as { default?: string }).default
    return typeof d === 'string' ? d : undefined
  }
  return undefined
}

/** Подмешивает поля из Payload page override в объект Metadata Next.js. */
export function mergePageSeoMetadata(fallback: Metadata, entry: SiteSeoPageOverride | null): Metadata {
  if (!entry) return fallback

  const seoT = str(entry.seoTitle)
  const baseTitle = str(entry.title) ?? seoT ?? pickTitle(fallback)
  const docTitle = baseTitle

  const desc =
    str(entry.metaDescription) ??
    (typeof fallback.description === 'string' ? fallback.description : undefined)

  const ogTitleResolved = str(entry.ogTitle) ?? seoT ?? docTitle
  const ogDescResolved = str(entry.ogDescription) ?? desc

  const twTitle = str(entry.twitterTitle) ?? ogTitleResolved
  const twDesc = str(entry.twitterDescription) ?? ogDescResolved

  const ogImageUrl = mediaToAbsoluteUrl(entry.ogImage)
  const ogImages =
    ogImageUrl !== undefined
      ? [{ url: ogImageUrl }]
      : fallback.openGraph && 'images' in fallback.openGraph
        ? fallback.openGraph.images
        : undefined

  const canonicalRaw = str(entry.canonicalUrl)
  const base = siteConfig.url.replace(/\/$/, '')
  const alternates = canonicalRaw
    ? {
        ...fallback.alternates,
        canonical:
          canonicalRaw.startsWith('http://') || canonicalRaw.startsWith('https://')
            ? canonicalRaw
            : `${base}${canonicalRaw.startsWith('/') ? '' : '/'}${canonicalRaw}`,
      }
    : fallback.alternates

  const out: Metadata = {
    ...fallback,
    ...(docTitle ? { title: docTitle } : {}),
    ...(desc ? { description: desc } : {}),
    ...(entry.robotsNoindex ? { robots: { index: false, follow: false } } : {}),
    ...(alternates ? { alternates } : {}),
    openGraph: {
      ...fallback.openGraph,
      ...(ogTitleResolved ? { title: ogTitleResolved } : {}),
      ...(ogDescResolved ? { description: ogDescResolved } : {}),
      ...(ogImages ? { images: ogImages as NonNullable<Metadata['openGraph']>['images'] } : {}),
    },
    twitter: {
      ...fallback.twitter,
      ...(twTitle ? { title: twTitle } : {}),
      ...(twDesc ? { description: twDesc } : {}),
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  }

  return out
}
