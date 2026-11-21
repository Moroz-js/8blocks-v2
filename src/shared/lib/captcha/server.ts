import { CAPTCHA_PROVIDER, type CaptchaProvider } from './provider'

/**
 * Серверная проверка токена капчи: Cloudflare Turnstile (EN/AE) или Яндекс SmartCaptcha (RU).
 *
 * Политика:
 * - секрет не задан → капча выключена, проверка пропускается (формы работают без ключей);
 * - сервис ответил «токен неверный» → отказ;
 * - сервис недоступен (сеть, таймаут, 5xx, внутренняя ошибка) или отверг наш секрет →
 *   заявка принимается, ошибка пишется в лог. Потерять клиента хуже, чем пропустить бота
 *   во время сбоя; Яндекс рекомендует так же.
 */

export type CaptchaVerdict =
  | { ok: true; skipped?: 'disabled' | 'unavailable' }
  | { ok: false; reason: 'missing-token' | 'rejected' }

interface VerifyConfig {
  provider: CaptchaProvider
  secret: string
  timeoutMs?: number
  fetchImpl?: typeof fetch
}

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const SMARTCAPTCHA_VERIFY_URL = 'https://smartcaptcha.yandexcloud.net/validate'
const DEFAULT_TIMEOUT_MS = 5000
const TOKEN_MAX = 4096

/** Коды Turnstile, при которых виноваты мы или Cloudflare, а не посетитель. */
const TURNSTILE_SERVER_SIDE_ERRORS: Record<string, true> = {
  'missing-input-secret': true,
  'invalid-input-secret': true,
  'internal-error': true,
}

export async function verifyCaptchaWith(
  config: VerifyConfig,
  token: unknown,
  remoteIp?: string,
): Promise<CaptchaVerdict> {
  if (!config.secret) return { ok: true, skipped: 'disabled' }
  if (typeof token !== 'string' || !token.trim() || token.length > TOKEN_MAX) {
    return { ok: false, reason: 'missing-token' }
  }

  const fetchImpl = config.fetchImpl ?? fetch
  const signal = AbortSignal.timeout(config.timeoutMs ?? DEFAULT_TIMEOUT_MS)
  const params = new URLSearchParams()

  try {
    if (config.provider === 'turnstile') {
      params.set('secret', config.secret)
      params.set('response', token)
      if (remoteIp) params.set('remoteip', remoteIp)
      const res = await fetchImpl(TURNSTILE_VERIFY_URL, { method: 'POST', body: params, signal })
      if (!res.ok) return unavailable(`turnstile HTTP ${res.status}`)
      const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] }
      if (data.success) return { ok: true }
      const codes = data['error-codes'] ?? []
      if (codes.some((code) => TURNSTILE_SERVER_SIDE_ERRORS[code])) {
        return unavailable(`turnstile ${codes.join(',')}`)
      }
      return { ok: false, reason: 'rejected' }
    }

    params.set('secret', config.secret)
    params.set('token', token)
    if (remoteIp) params.set('ip', remoteIp)
    const res = await fetchImpl(SMARTCAPTCHA_VERIFY_URL, { method: 'POST', body: params, signal })
    if (!res.ok) return unavailable(`smartcaptcha HTTP ${res.status}`)
    const data = (await res.json()) as { status?: string; message?: string }
    if (data.status === 'ok') return { ok: true }
    return { ok: false, reason: 'rejected' }
  } catch (err) {
    return unavailable(err instanceof Error ? err.message : String(err))
  }
}

function unavailable(detail: string): CaptchaVerdict {
  console.error(`[captcha] provider unavailable, request accepted: ${detail}`)
  return { ok: true, skipped: 'unavailable' }
}

/** IP посетителя за nginx (первый адрес X-Forwarded-For или X-Real-IP). */
export function clientIp(headers: Headers): string | undefined {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || headers.get('x-real-ip')?.trim() || undefined
}

/** Проверка с провайдером по языку сборки и секретом из `CAPTCHA_SECRET_KEY`. */
export function verifyCaptcha(token: unknown, remoteIp?: string): Promise<CaptchaVerdict> {
  return verifyCaptchaWith(
    { provider: CAPTCHA_PROVIDER, secret: (process.env.CAPTCHA_SECRET_KEY || '').trim() },
    token,
    remoteIp,
  )
}
