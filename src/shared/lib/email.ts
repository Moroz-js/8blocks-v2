import { domainToASCII } from 'node:url'
import { siteConfig } from '@/shared/config/site'
import { lang } from '@/shared/i18n'
import {
  escHtml,
  sanitizeEmailSubject,
  stripEmailHeaderInjection,
} from '@/shared/lib/form-sanitize'

// ── Brand (одна локаль на инстанс) ─────────────────────────────────

interface EmailBrand {
  name: string
  siteUrl: string
  siteLabel: string
  email: string
  tagline: string
}

const isAe = /8blocks\.ae/i.test(siteConfig.url)

const brand: EmailBrand =
  lang === 'ru'
    ? {
        name: 'А8А9',
        siteUrl: 'https://tokenomika.ru',
        siteLabel: 'tokenomika.ru',
        email: 'hi@токеномика.рф',
        tagline: 'Дизайн токен-экономики',
      }
    : isAe
      ? {
          name: '8Blocks',
          siteUrl: 'https://8blocks.ae',
          siteLabel: '8blocks.ae',
          email: 'hello@8blocks.ae',
          tagline: 'Token Economy Design',
        }
      : {
          name: '8Blocks',
          siteUrl: 'https://8blocks.io',
          siteLabel: '8blocks.io',
          email: 'hello@8blocks.io',
          tagline: 'Token Economy Design',
        }

const isRu = lang === 'ru'

/** Куда слать админские уведомления (единый ящик для всех инстансов). Fallback: адрес бренда. */
function resolveAdminNotifyInbox(): string {
  return process.env.ADMIN_NOTIFY_EMAIL?.trim() || brand.email
}

// ── Delivery ───────────────────────────────────────────────────────
// RU → Unisender Go, EN/AE → Resend. Оба по HTTPS (SMTP-порты на хостинге закрыты).

interface OutgoingMail {
  to: string
  subject: string
  html: string
  fromEmail: string
  fromName: string
  replyTo: string
}

/** IDN-домен (hi@токеномика.рф) в punycode — API провайдеров ждут ASCII. */
function asciiEmail(email: string): string {
  const at = email.lastIndexOf('@')
  if (at < 0) return email
  return `${email.slice(0, at)}@${domainToASCII(email.slice(at + 1)) || email.slice(at + 1)}`
}

async function sendViaUnisenderGo(mail: OutgoingMail, apiKey: string) {
  const base = process.env.UNISENDER_GO_API_URL?.trim() || 'https://go2.unisender.ru/ru/transactional/api/v1'
  const res = await fetch(`${base.replace(/\/$/, '')}/email/send.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': apiKey },
    body: JSON.stringify({
      message: {
        recipients: [{ email: mail.to }],
        subject: mail.subject,
        body: { html: mail.html },
        from_email: mail.fromEmail,
        from_name: mail.fromName,
        reply_to: mail.replyTo,
        track_links: 0,
        track_read: 0,
      },
    }),
  })
  const data = (await res.json().catch(() => ({}))) as { status?: string; message?: string }
  if (!res.ok || data.status !== 'success') {
    throw new Error(`Unisender Go ${res.status}: ${data.message ?? 'unknown error'}`)
  }
}

async function sendViaResend(mail: OutgoingMail, apiKey: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: `${mail.fromName} <${mail.fromEmail}>`,
      to: [mail.to],
      subject: mail.subject,
      html: mail.html,
      reply_to: mail.replyTo,
    }),
  })
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { message?: string }
    throw new Error(`Resend ${res.status}: ${data.message ?? 'unknown error'}`)
  }
}

async function send(options: {
  to: string
  subject: string
  html: string
  /** client — письмо посетителю сайта, admin — уведомление в ADMIN_NOTIFY_EMAIL. */
  audience: 'client' | 'admin'
}) {
  let to = stripEmailHeaderInjection(options.to).replace(/\s/g, '')
  if (!to) {
    console.warn('[email] empty recipient after sanitization — skip')
    return
  }

  let subject = sanitizeEmailSubject(options.subject)
  // Тест: клиентские письма уходят на EMAIL_TEST_RECIPIENT, админские — как обычно.
  const testRecipient = process.env.EMAIL_TEST_RECIPIENT?.trim()
  if (testRecipient && options.audience === 'client') {
    subject = sanitizeEmailSubject(`[test → ${to}] ${subject}`)
    to = testRecipient
  }

  const mail: OutgoingMail = {
    to: asciiEmail(to),
    subject,
    html: options.html,
    fromEmail: process.env.EMAIL_FROM?.trim() || (isRu ? 'noreply@tokenomika.ru' : 'noreply@8blocks.io'),
    fromName: brand.name,
    replyTo: asciiEmail(brand.email),
  }

  const apiKey = isRu ? process.env.UNISENDER_GO_API_KEY?.trim() : process.env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    console.log(
      `[email] ${isRu ? 'UNISENDER_GO_API_KEY' : 'RESEND_API_KEY'} not set — skip "${subject}" to ${mail.to}`,
    )
    return
  }

  await (isRu ? sendViaUnisenderGo(mail, apiKey) : sendViaResend(mail, apiKey))
}

// ── Layout helper ──────────────────────────────────────────────────

/**
 * Знак 8Blocks таблицей (как в en-logo.svg): «лесенка» из полос.
 * Без картинок — почтовые клиенты режут SVG и внешние изображения.
 */
const MARK_COLS = [9, 2, 4, 2, 4, 2, 4]
const MARK_ROWS = [4, 2, 4, 2, 4, 2, 4, 2, 4]
const MARK_FILL = [
  '1111101',
  '0000001',
  '1110101',
  '0000101',
  '1010101',
  '0010101',
  '1010101',
  '0000000',
  '1111111',
]

function mark8Blocks(): string {
  const rows = MARK_ROWS.map((h, r) => {
    const cells = MARK_COLS.map((w, c) => {
      const bg = MARK_FILL[r][c] === '1' ? 'background:#ffffff;' : ''
      return `<td width="${w}" height="${h}" style="width:${w}px;height:${h}px;${bg}font-size:0;line-height:0;"></td>`
    }).join('')
    return `<tr>${cells}</tr>`
  }).join('')
  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">${rows}</table>`
}

function header(): string {
  const wordmark = `<span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.03em;line-height:1;">${escHtml(brand.name)}</span>`
  if (isRu) return wordmark
  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
    <td style="vertical-align:middle;padding-right:10px;">${mark8Blocks()}</td>
    <td style="vertical-align:middle;">${wordmark}</td>
  </tr></table>`
}

function mailto(): string {
  return `<a href="mailto:${brand.email}" style="color:#C24E88;text-decoration:none;">${brand.email}</a>`
}

function wrap(body: string): string {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escHtml(brand.name)}</title>
</head>
<body style="margin:0;padding:0;background:#0e0e12;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0e0e12;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#18181f;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding:28px 36px 20px;border-bottom:1px solid rgba(255,255,255,0.07);">
              ${header()}
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 36px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px 28px;border-top:1px solid rgba(255,255,255,0.07);">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);line-height:1.6;">
                ${escHtml(brand.name)} · ${escHtml(brand.tagline)}<br />
                <a href="${brand.siteUrl}" style="color:rgba(194,78,136,0.8);text-decoration:none;">${brand.siteLabel}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function h1(text: string): string {
  return `<h1 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#ffffff;letter-spacing:-0.02em;line-height:1.25;">${escHtml(text)}</h1>`
}

function p(text: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;">${text}</p>`
}

function field(label: string, value: string): string {
  return `<div style="margin-bottom:16px;">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.35);">${escHtml(label)}</p>
    <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.8);word-break:break-word;white-space:pre-wrap;">${escHtml(value)}</p>
  </div>`
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:24px 0;" />`
}

// ── Templates ──────────────────────────────────────────────────────

// 1. Contact → user confirmation
export async function sendContactUser(to: string, data: {
  name: string
  email: string
  message: string
}) {
  const html = wrap(
    h1(isRu ? 'Мы получили ваше сообщение' : 'We received your message') +
    p(isRu
      ? 'Спасибо за обращение! Мы рассмотрим ваш запрос и ответим в течение одного рабочего дня.'
      : "Thanks for reaching out! We'll review your request and get back to you within one business day."
    ) +
    divider() +
    field(isRu ? 'Ваше сообщение' : 'Your message', data.message) +
    divider() +
    p(isRu
      ? `Если у вас есть вопросы, вы можете ответить на это письмо или написать нам на ${mailto()}.`
      : `If you have any questions in the meantime, you can reply to this email or contact us at ${mailto()}.`
    )
  )

  await send({
    audience: 'client',
    to,
    subject: isRu
      ? `Мы получили ваше сообщение — ${brand.name}`
      : `We received your message — ${brand.name}`,
    html,
  })
}

// 2. Contact → admin notification
export async function sendContactAdmin(data: {
  name: string
  email: string
  message: string
}) {
  const html = wrap(
    h1(isRu ? 'Новая заявка с сайта' : 'New contact form submission') +
    field(isRu ? 'Сайт' : 'Site', brand.siteUrl) +
    field(isRu ? 'Имя' : 'Name', data.name) +
    field('Email', data.email) +
    field(isRu ? 'Сообщение' : 'Message', data.message)
  )

  await send({
    audience: 'admin',
    to: resolveAdminNotifyInbox(),
    subject: isRu
      ? `Новая заявка: ${data.name} — ${brand.name}`
      : `New lead: ${data.name} — ${brand.name}`,
    html,
  })
}

// 3. Newsletter → user confirmation
export async function sendNewsletterUser(to: string) {
  const html = wrap(
    h1(isRu ? 'Вы подписаны!' : "You're subscribed!") +
    p(isRu
      ? `Вы успешно подписались на рассылку ${brand.name}. Мы будем присылать аналитику по токен-экономике, паттерны Web3-проектирования и практические инсайты — без воды, только суть.`
      : `You've successfully subscribed to the ${brand.name} newsletter. We'll send you insights on token economics, Web3 design patterns, and practical tokenomics — no fluff, just substance.`
    ) +
    divider() +
    p(isRu
      ? 'Чтобы отписаться, ответьте на это письмо со словом «отписаться» в теме.'
      : 'To unsubscribe or manage your preferences, reply to this email with "unsubscribe" in the subject.'
    )
  )

  await send({
    audience: 'client',
    to,
    subject: isRu
      ? `Вы подписаны на рассылку ${brand.name}`
      : `You're subscribed to ${brand.name} newsletter`,
    html,
  })
}

// 4. Newsletter → admin notification
export async function sendNewsletterAdmin(email: string, source?: string) {
  const html = wrap(
    h1(isRu ? 'Новый подписчик рассылки' : 'New newsletter subscriber') +
    field(isRu ? 'Сайт' : 'Site', brand.siteUrl) +
    field('Email', email) +
    (source ? field(isRu ? 'Источник' : 'Source', source) : '')
  )

  await send({
    audience: 'admin',
    to: resolveAdminNotifyInbox(),
    subject: isRu
      ? `Новый подписчик: ${email} — ${brand.name}`
      : `New subscriber: ${email} — ${brand.name}`,
    html,
  })
}
