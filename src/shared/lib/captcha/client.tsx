'use client'

import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { uiStrings } from '@/shared/content/uiStrings'
import { CAPTCHA_PROVIDER, HONEYPOT_FIELD } from './provider'
import styles from './captcha.module.scss'

/**
 * Капча на формах: Turnstile (EN/AE) или SmartCaptcha (RU), невидимый режим с проверкой при отправке.
 * Скрипт провайдера грузится один раз — при первом фокусе в форме или при отправке, а не на каждой странице.
 * Без NEXT_PUBLIC_CAPTCHA_SITE_KEY капча выключена: getToken() возвращает undefined.
 */

const SITE_KEY = (process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || '').trim()
export const captchaEnabled = SITE_KEY !== ''

const ONLOAD = '__captchaOnload'
const SCRIPT_URL =
  CAPTCHA_PROVIDER === 'turnstile'
    ? `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=${ONLOAD}`
    : `https://smartcaptcha.yandexcloud.net/captcha.js?render=onload&onload=${ONLOAD}`
const LOAD_TIMEOUT_MS = 15_000
/** Сколько ждать решения задания, если провайдер попросил человека что-то сделать. */
const SOLVE_TIMEOUT_MS = 120_000

type WidgetId = string | number

interface TurnstileApi {
  render(container: HTMLElement, options: Record<string, unknown>): string
  execute(widgetId: string): void
  reset(widgetId: string): void
  remove(widgetId: string): void
}

interface SmartCaptchaApi {
  render(container: HTMLElement, options: Record<string, unknown>): number
  execute(widgetId: number): void
  reset(widgetId: number): void
  destroy(widgetId: number): void
  subscribe(widgetId: number, event: string, callback: () => void): () => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
    smartCaptcha?: SmartCaptchaApi
    [ONLOAD]?: () => void
  }
}

let scriptPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise<void>((resolve, reject) => {
    if (CAPTCHA_PROVIDER === 'turnstile' ? window.turnstile : window.smartCaptcha) return resolve()
    const script = document.createElement('script')
    const fail = () => {
      clearTimeout(timer)
      script.remove()
      scriptPromise = null
      reject(new Error(uiStrings.captchaLoadError))
    }
    const timer = setTimeout(fail, LOAD_TIMEOUT_MS)
    window[ONLOAD] = () => {
      clearTimeout(timer)
      resolve()
    }
    script.src = SCRIPT_URL
    script.async = true
    script.onerror = fail
    document.head.appendChild(script)
  })
  return scriptPromise
}

interface Pending {
  resolve: (token: string) => void
  reject: (error: Error) => void
}

export interface Captcha {
  /** Контейнер виджета — положить внутрь формы. Пустой, пока провайдер не попросит действие. */
  widget: ReactNode
  /** Заранее загрузить скрипт (onFocus формы). */
  preload: () => void
  /** Токен для отправки на сервер; undefined, если капча выключена. Бросает Error с текстом для пользователя. */
  getToken: () => Promise<string | undefined>
  /** Сбросить после отправки: токен одноразовый. */
  reset: () => void
}

export function useCaptcha(): Captcha {
  const container = useRef<HTMLDivElement>(null)
  const widgetId = useRef<WidgetId | null>(null)
  const pending = useRef<Pending | null>(null)
  /** Контейнер, в котором отрисован виджет: модальные формы монтируют новый при каждом открытии. */
  const renderedIn = useRef<HTMLElement | null>(null)

  const settle = useCallback((token: string | null) => {
    const current = pending.current
    pending.current = null
    if (!current) return
    if (token) current.resolve(token)
    else current.reject(new Error(uiStrings.captchaFailed))
  }, [])

  const removeWidget = useCallback(() => {
    const id = widgetId.current
    widgetId.current = null
    renderedIn.current = null
    if (id === null) return
    if (CAPTCHA_PROVIDER === 'turnstile') window.turnstile?.remove(id as string)
    else window.smartCaptcha?.destroy(id as number)
  }, [])

  // После await всё синхронно: параллельные вызовы (preload + getToken) не отрисуют виджет дважды.
  const ensureWidget = useCallback(async () => {
    await loadScript()
    const el = container.current
    if (!el || (widgetId.current !== null && renderedIn.current === el)) return
    removeWidget()
    renderedIn.current = el
    if (CAPTCHA_PROVIDER === 'turnstile') {
      widgetId.current = window.turnstile!.render(el, {
        sitekey: SITE_KEY,
        execution: 'execute',
        appearance: 'interaction-only',
        callback: (token: string) => settle(token),
        'error-callback': () => {
          settle(null)
          return true
        },
        'timeout-callback': () => settle(null),
      })
      return
    }
    const api = window.smartCaptcha!
    const id = api.render(el, {
      sitekey: SITE_KEY,
      invisible: true,
      hl: 'ru',
      callback: (token: string) => settle(token),
    })
    // Человек закрыл задание, не решив, или у провайдера сбой — разблокировать форму.
    for (const event of ['challenge-hidden', 'network-error', 'javascript-error']) {
      api.subscribe(id, event, () => settle(null))
    }
    widgetId.current = id
  }, [settle, removeWidget])

  const preload = useCallback(() => {
    if (captchaEnabled) ensureWidget().catch(() => {})
  }, [ensureWidget])

  const getToken = useCallback(async () => {
    if (!captchaEnabled) return undefined
    await ensureWidget()
    const id = widgetId.current
    if (id === null) throw new Error(uiStrings.captchaLoadError)
    return new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => settle(null), SOLVE_TIMEOUT_MS)
      pending.current = {
        resolve: (token) => {
          clearTimeout(timer)
          resolve(token)
        },
        reject: (error) => {
          clearTimeout(timer)
          reject(error)
        },
      }
      if (CAPTCHA_PROVIDER === 'turnstile') window.turnstile!.execute(id as string)
      else window.smartCaptcha!.execute(id as number)
    })
  }, [ensureWidget, settle])

  const reset = useCallback(() => {
    const id = widgetId.current
    if (id === null) return
    if (CAPTCHA_PROVIDER === 'turnstile') window.turnstile?.reset(id as string)
    else window.smartCaptcha?.reset(id as number)
  }, [])

  useEffect(
    () => () => {
      pending.current = null
      removeWidget()
    },
    [removeWidget],
  )

  const widget = useMemo(() => (captchaEnabled ? <div ref={container} className={styles.widget} /> : null), [])

  return { widget, preload, getToken, reset }
}

/** Скрытое поле-ловушка. Значение отправлять на сервер как есть (`readHoneypot`). */
export function Honeypot() {
  return (
    <div className={styles.honeypot} aria-hidden="true">
      <label>
        Website
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  )
}

export function readHoneypot(form: HTMLFormElement): string {
  return String(new FormData(form).get(HONEYPOT_FIELD) ?? '')
}
