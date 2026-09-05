import type { Metadata } from 'next'
import { getSiteSeoPageOverride } from './get-site-seo'
import { mergePageSeoMetadata } from './merge-metadata'
import { buildLanguageAlternates, type HreflangOptions } from './hreflang'

/**
 * Метаданные страницы с учётом глобала «SEO — …» для статического маршрута.
 * Добавляет hreflang (alternates.languages) для всех маршрутов, если страница не noindex
 * и языки не заданы явно в fallback.
 */
export async function withPayloadPageMetadata(
  contentPath: string,
  fallback: Metadata,
  hreflang: HreflangOptions = {},
): Promise<Metadata> {
  const entry = await getSiteSeoPageOverride(contentPath)
  const merged = mergePageSeoMetadata(fallback, entry)

  const robots = merged.robots
  const noindex =
    typeof robots === 'object' && robots !== null && 'index' in robots && robots.index === false
  if (noindex || merged.alternates?.languages) return merged

  const languages = buildLanguageAlternates(contentPath, hreflang)
  if (!languages) return merged

  return {
    ...merged,
    alternates: { ...merged.alternates, languages },
  }
}
