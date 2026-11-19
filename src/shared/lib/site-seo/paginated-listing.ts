import type { Metadata } from 'next'
import { lang } from '@/shared/i18n'
import type { HreflangOptions } from './hreflang'

export type PaginatedListingSeo = {
  page: number
  /** Self-referencing canonical: страница N > 1 канонизируется на себя, а не на первую. */
  canonical: string
  /** hreflang только у первой страницы: на доменах других языков другое число страниц. */
  hreflang: HreflangOptions
}

export function paginatedListingSeo(path: string, pageParam: string | undefined): PaginatedListingSeo {
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  if (page === 1) return { page, canonical: path, hreflang: {} }
  return { page, canonical: `${path}?page=${page}`, hreflang: { none: true } }
}

/**
 * Применяется ПОСЛЕ withPayloadPageMetadata: page override из глобала «SEO» задаёт для листинга
 * title, canonical и hreflang первой страницы — для ?page=N их нужно перебить.
 */
export function withPaginatedListing(metadata: Metadata, listing: PaginatedListingSeo): Metadata {
  if (listing.page === 1) return metadata
  const suffix = lang === 'ru' ? ` — страница ${listing.page}` : ` — page ${listing.page}`
  const title = typeof metadata.title === 'string' ? `${metadata.title}${suffix}` : metadata.title
  return {
    ...metadata,
    title,
    alternates: { ...metadata.alternates, canonical: listing.canonical, languages: undefined },
    openGraph: { ...metadata.openGraph, url: listing.canonical },
  }
}
