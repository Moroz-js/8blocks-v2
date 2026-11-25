import { afterEach, expect, it, vi } from 'vitest'

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules() })

it.each([
  ['ru', 'Пожалуйста, заполните все обязательные поля', 'Пожалуйста, введите корректный email'],
  ['en', 'Please fill in all required fields', 'Please enter a valid email address'],
])('validates the contact form in the %s build', async (lang, required, invalidEmail) => {
  vi.stubEnv('NEXT_PUBLIC_LANG', lang)
  vi.resetModules()
  const { sanitizeContactForm } = await import('../form-sanitize')
  const valid = { name: 'Test', email: 'test@example.com', message: 'Test' }
  for (const body of [{}, { ...valid, name: ' ' }, { ...valid, message: '' }]) {
    expect(sanitizeContactForm(body)).toEqual({ ok: false, error: required })
  }
  expect(sanitizeContactForm({ ...valid, email: 'invalid' })).toEqual({ ok: false, error: invalidEmail })
  expect(sanitizeContactForm(valid)).toEqual({ ok: true, ...valid })
})
