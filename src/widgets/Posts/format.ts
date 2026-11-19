import { lang } from '@/shared/i18n'

/** «Nov 3, 2026» / «3 нояб. 2026 г.» — the date in listing meta lines. */
export function formatPostDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-US' : 'ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** «Category · date», skipping empty parts. */
export function postMeta(...parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(' · ')
}
