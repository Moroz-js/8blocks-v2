import type { Lang } from '@/shared/i18n'
import type { SiteSeoGlobalDoc } from './types'

/** Значения по умолчанию, если в админке глобала SEO поле пустое */
export const WORKSHOP_TRUST_SLOTS_NOTE_FALLBACK: Record<Lang, string> = {
  ru: 'Сейчас доступно 2 слота на май.',
  en: 'Currently 2 slots available in May.',
}

export function resolveWorkshopTrustSlotsNote(
  lang: Lang,
  siteSeo: SiteSeoGlobalDoc | null,
): string {
  const raw =
    lang === 'ru' ? siteSeo?.workshopTrustSlotsNoteRu : siteSeo?.workshopTrustSlotsNoteEn
  const trimmed = typeof raw === 'string' ? raw.trim() : ''
  if (trimmed) return trimmed
  return WORKSHOP_TRUST_SLOTS_NOTE_FALLBACK[lang]
}
