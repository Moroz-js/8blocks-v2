export type Lang = 'ru' | 'en'

const rawLang = process.env.NEXT_PUBLIC_LANG

export const lang: Lang = rawLang === 'en' ? 'en' : 'ru'
export const locale = lang === 'en' ? 'en_US' : 'ru_RU'
export const htmlLang = lang

export function t<T>(variants: { ru: T; en: T }): T {
  return variants[lang]
}
