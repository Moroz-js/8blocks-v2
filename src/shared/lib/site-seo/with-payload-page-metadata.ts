import type { Metadata } from 'next'
import { getSiteSeoPageOverride } from './get-site-seo'
import { mergePageSeoMetadata } from './merge-metadata'

/** Метаданные страницы с учётом глобала «SEO — …» для статического маршрута. */
export async function withPayloadPageMetadata(
  contentPath: string,
  fallback: Metadata,
): Promise<Metadata> {
  const entry = await getSiteSeoPageOverride(contentPath)
  return mergePageSeoMetadata(fallback, entry)
}
