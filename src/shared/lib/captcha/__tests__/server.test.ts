import { describe, expect, it, vi } from 'vitest'
import { verifyCaptchaWith } from '../server'
import { isHoneypotFilled } from '../provider'

const json = (body: unknown, status = 200) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } }))

describe('verifyCaptchaWith', () => {
  it('skips the check when no secret is configured, so forms keep working before keys are added', async () => {
    const fetchImpl = vi.fn()
    const verdict = await verifyCaptchaWith({ provider: 'turnstile', secret: '', fetchImpl }, undefined)
    expect(verdict).toEqual({ ok: true, skipped: 'disabled' })
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('rejects a request without a token without calling the provider', async () => {
    const fetchImpl = vi.fn()
    const verdict = await verifyCaptchaWith({ provider: 'turnstile', secret: 's', fetchImpl }, '')
    expect(verdict).toEqual({ ok: false, reason: 'missing-token' })
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('accepts a token Turnstile confirms and sends secret, token and IP', async () => {
    const fetchImpl = json({ success: true })
    const verdict = await verifyCaptchaWith({ provider: 'turnstile', secret: 'sec', fetchImpl }, 'tok', '1.2.3.4')
    expect(verdict).toEqual({ ok: true })
    const body = (fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].body as URLSearchParams
    expect(Object.fromEntries(body)).toEqual({ secret: 'sec', response: 'tok', remoteip: '1.2.3.4' })
  })

  it('rejects a token Turnstile marks invalid or reused', async () => {
    const fetchImpl = json({ success: false, 'error-codes': ['timeout-or-duplicate'] })
    expect(await verifyCaptchaWith({ provider: 'turnstile', secret: 's', fetchImpl }, 'tok')).toEqual({
      ok: false,
      reason: 'rejected',
    })
  })

  it('lets the lead through when Turnstile rejects our secret or fails internally', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    for (const code of ['invalid-input-secret', 'internal-error']) {
      const fetchImpl = json({ success: false, 'error-codes': [code] })
      expect(await verifyCaptchaWith({ provider: 'turnstile', secret: 's', fetchImpl }, 'tok')).toEqual({
        ok: true,
        skipped: 'unavailable',
      })
    }
    spy.mockRestore()
  })

  it('lets the lead through when the provider is unreachable or answers 5xx', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const down = vi.fn(async () => {
      throw new TypeError('fetch failed')
    })
    expect(await verifyCaptchaWith({ provider: 'smartcaptcha', secret: 's', fetchImpl: down }, 'tok')).toEqual({
      ok: true,
      skipped: 'unavailable',
    })
    expect(await verifyCaptchaWith({ provider: 'smartcaptcha', secret: 's', fetchImpl: json({}, 503) }, 'tok')).toEqual({
      ok: true,
      skipped: 'unavailable',
    })
    spy.mockRestore()
  })

  it('maps SmartCaptcha status to the verdict and sends token and IP', async () => {
    const ok = json({ status: 'ok', host: 'tokenomika.ru' })
    expect(await verifyCaptchaWith({ provider: 'smartcaptcha', secret: 'sec', fetchImpl: ok }, 'tok', '5.6.7.8')).toEqual({ ok: true })
    const body = (ok.mock.calls[0] as unknown as [string, RequestInit])[1].body as URLSearchParams
    expect(Object.fromEntries(body)).toEqual({ secret: 'sec', token: 'tok', ip: '5.6.7.8' })

    const failed = json({ status: 'failed', message: 'Token invalid or expired.' })
    expect(await verifyCaptchaWith({ provider: 'smartcaptcha', secret: 's', fetchImpl: failed }, 'tok')).toEqual({
      ok: false,
      reason: 'rejected',
    })
  })
})

describe('isHoneypotFilled', () => {
  it('flags a filled trap field and ignores an empty one', () => {
    expect(isHoneypotFilled({ email: 'a@b.co', website: 'http://spam.example' })).toBe(true)
    expect(isHoneypotFilled({ email: 'a@b.co', website: '   ' })).toBe(false)
    expect(isHoneypotFilled({ email: 'a@b.co' })).toBe(false)
  })

  it('flags non-string values a bot may send', () => {
    expect(isHoneypotFilled({ website: 1 })).toBe(true)
  })
})
