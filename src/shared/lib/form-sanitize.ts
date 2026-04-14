/**
 * Санитизация и ограничения для публичных форм (XSS, CRLF в заголовках писем, control chars, перегруз по длине).
 */

/** Тексты для API и ValidationError в Payload (как существующие ответы форм). */
export const PUBLIC_FORM_ERRORS = {
  leadDuplicateEmail: 'A submission with this email was already received.',
  newsletterDuplicateEmail: 'This email is already subscribed.',
} as const

export const FORM_LIMITS = {
  nameMax: 200,
  messageMax: 10000,
  emailMax: 254,
} as const

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Экранирование для вставки в HTML-текстовые узлы и безопасных контекстах. */
export function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Удаляет управляющие символы и переводы строк — недопустимы в Subject/From и обходят заголовки SMTP. */
export function stripEmailHeaderInjection(str: string): string {
  return str
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/[\r\n]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Тема письма: без CRLF, с ограничением длины (RFC 5322 рекомендует ≤ 998 октетов на строку). */
export function sanitizeEmailSubject(str: string, maxLen = 900): string {
  const cleaned = stripEmailHeaderInjection(str)
  if (cleaned.length <= maxLen) return cleaned
  return `${cleaned.slice(0, maxLen - 1)}…`
}

export function sanitizeContactForm(body: unknown):
  | { ok: true; name: string; email: string; message: string }
  | { ok: false; error: string } {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Invalid request body' }
  }
  const o = body as Record<string, unknown>
  if (typeof o.name !== 'string' || typeof o.email !== 'string' || typeof o.message !== 'string') {
    return { ok: false, error: 'Please fill in all required fields' }
  }

  let name = o.name.replace(/\0/g, '').trim()
  let email = o.email.replace(/\0/g, '').trim().toLowerCase()
  let message = o.message.replace(/\0/g, '').trim()

  name = name.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()

  if (!name || !email || !message) {
    return { ok: false, error: 'Please fill in all required fields' }
  }
  if (name.length > FORM_LIMITS.nameMax) {
    return { ok: false, error: 'Name is too long' }
  }
  if (message.length > FORM_LIMITS.messageMax) {
    return { ok: false, error: 'Message is too long' }
  }
  if (email.length > FORM_LIMITS.emailMax || /[\r\n]/.test(o.email)) {
    return { ok: false, error: 'Please enter a valid email address' }
  }
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, error: 'Please enter a valid email address' }
  }

  return { ok: true, name, email, message }
}

export function sanitizeNewsletterEmail(body: unknown):
  | { ok: true; email: string }
  | { ok: false; error: string } {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Invalid request body' }
  }
  const raw = (body as Record<string, unknown>).email
  if (typeof raw !== 'string') {
    return { ok: false, error: 'Please enter your email address' }
  }
  if (/[\r\n]/.test(raw)) {
    return { ok: false, error: 'Please enter a valid email address' }
  }

  const email = raw.replace(/\0/g, '').trim().toLowerCase()
  if (!email) {
    return { ok: false, error: 'Please enter your email address' }
  }
  if (email.length > FORM_LIMITS.emailMax) {
    return { ok: false, error: 'Please enter a valid email address' }
  }
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, error: 'Please enter a valid email address' }
  }

  return { ok: true, email }
}

/** Для сохранения в БД из любого источника (в т.ч. админка): без NUL и лишних переводов строк в имени. */
export function sanitizeLeadName(raw: string): string {
  return raw
    .replace(/\0/g, '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function sanitizeLeadMessage(raw: string): string {
  return raw.replace(/\0/g, '').trim()
}
