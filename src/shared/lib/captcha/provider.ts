import { lang } from '@/shared/i18n'

export type CaptchaProvider = 'turnstile' | 'smartcaptcha'

/** RU (tokenomika.ru) — Яндекс SmartCaptcha: Cloudflare в РФ замедляют. EN/AE — Turnstile. */
export const CAPTCHA_PROVIDER: CaptchaProvider = lang === 'ru' ? 'smartcaptcha' : 'turnstile'

/** Имя скрытого поля-ловушки: человек его не видит, боты заполняют. */
export const HONEYPOT_FIELD = 'website'

/** true, если ловушка заполнена — запрос от бота. */
export function isHoneypotFilled(body: unknown): boolean {
  if (body === null || typeof body !== 'object') return false
  const value = (body as Record<string, unknown>)[HONEYPOT_FIELD]
  return typeof value === 'string' ? value.trim() !== '' : value !== undefined && value !== null
}
