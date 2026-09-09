import type { Metadata } from 'next'
import { lang } from '@/shared/i18n'
import { normalizeContentPath } from './normalize-path'

/** Production-хосты языковых версий. hreflang всегда указывает на прод, независимо от текущего хоста. */
export const HREFLANG_HOSTS = {
  en: 'https://8blocks.io',
  'en-AE': 'https://8blocks.ae',
  ru: 'https://tokenomika.ru',
} as const

export type HreflangOptions = {
  /** Путь этой страницы на сайте другого языка (EN ↔ RU). По умолчанию — тот же путь. */
  otherLangPath?: string | null
  /** Страница существует только на текущем языке — hreflang не выводить. */
  none?: boolean
}

function withHost(host: string, path: string): string {
  const n = normalizeContentPath(path)
  return n === '/' ? host : `${host}${n}`
}

/**
 * alternates.languages для Next Metadata: en → .io, en-AE → .ae, ru → tokenomika.ru, x-default → .io.
 * На staging не выводится. Возвращает undefined, если hreflang не нужен.
 */
export function buildLanguageAlternates(
  path: string,
  opts: HreflangOptions = {},
): NonNullable<Metadata['alternates']>['languages'] | undefined {
  if (opts.none) return undefined
  if (process.env.NEXT_PUBLIC_STAGING === 'true') return undefined

  const own = path
  const other = opts.otherLangPath?.trim() || path
  const enPath = lang === 'ru' ? other : own
  const ruPath = lang === 'ru' ? own : other

  return {
    en: withHost(HREFLANG_HOSTS.en, enPath),
    'en-AE': withHost(HREFLANG_HOSTS['en-AE'], enPath),
    ru: withHost(HREFLANG_HOSTS.ru, ruPath),
    'x-default': withHost(HREFLANG_HOSTS.en, enPath),
  }
}
