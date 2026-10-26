import { lang } from '@/shared/i18n'
import type { HreflangOptions } from './hreflang'

export type PaginatedListingSeo = {
  page: number
  /** Self-referencing canonical: страница N > 1 канонизируется на себя, а не на первую. */
  canonical: string
  /** Добавка к title, чтобы страницы листинга не дублировали друг друга. */
  titleSuffix: string
  /** hreflang только у первой страницы: на доменах других языков другое число страниц. */
  hreflang: HreflangOptions
}

export function paginatedListingSeo(path: string, pageParam: string | undefined): PaginatedListingSeo {
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  if (page === 1) return { page, canonical: path, titleSuffix: '', hreflang: {} }
  return {
    page,
    canonical: `${path}?page=${page}`,
    titleSuffix: lang === 'ru' ? ` — страница ${page}` : ` — page ${page}`,
    hreflang: { none: true },
  }
}
