import nodemailer from 'nodemailer'

// ── Transporter ────────────────────────────────────────────────────

function createTransporter() {
  const host = process.env.SMTP_HOST
  if (!host) return null

  return nodemailer.createTransport({
    host,
    port:   parseInt(process.env.SMTP_PORT ?? '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER ?? '',
      pass: process.env.SMTP_PASSWORD ?? '',
    },
  })
}

async function send(options: {
  to: string
  subject: string
  html: string
}) {
  const transporter = createTransporter()
  if (!transporter) {
    console.log('[email] SMTP_HOST not set — skipping email send')
    return
  }

  const from = process.env.SMTP_FROM ?? 'hello@8blocks.io'

  await transporter.sendMail({
    from: `"8Blocks" <${from}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  })
}

// ── Layout helper ──────────────────────────────────────────────────

function wrap(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>8Blocks</title>
</head>
<body style="margin:0;padding:0;background:#0e0e12;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0e0e12;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#18181f;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding:28px 36px 20px;border-bottom:1px solid rgba(255,255,255,0.07);">
              <span style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">8Blocks</span>
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
                8Blocks · Token Economy Design<br />
                <a href="https://8blocks.io" style="color:rgba(194,78,136,0.8);text-decoration:none;">8blocks.io</a>
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
  return `<h1 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#ffffff;letter-spacing:-0.02em;line-height:1.25;">${text}</h1>`
}

function p(text: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;">${text}</p>`
}

function field(label: string, value: string): string {
  return `<div style="margin-bottom:16px;">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.35);">${label}</p>
    <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.8);word-break:break-word;">${escHtml(value)}</p>
  </div>`
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:24px 0;" />`
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── Templates ──────────────────────────────────────────────────────

// 1. Contact → user confirmation
export async function sendContactUser(to: string, data: {
  name: string
  email: string
  message: string
}) {
  const html = wrap(
    h1('We received your message') +
    p(`Hi ${escHtml(data.name)}, thanks for reaching out! We'll review your request and get back to you within one business day.`) +
    divider() +
    field('Your message', data.message) +
    divider() +
    p('If you have any questions in the meantime, you can reply to this email or contact us at <a href="mailto:hi@токеномика.рф" style="color:#C24E88;text-decoration:none;">hi@токеномика.рф</a>.')
  )

  await send({ to, subject: 'We received your message — 8Blocks', html })
}

// 2. Contact → admin notification
export async function sendContactAdmin(data: {
  name: string
  email: string
  message: string
}) {
  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.SMTP_FROM ?? ''
  if (!adminEmail) return

  const html = wrap(
    h1('New contact form submission') +
    field('Name', data.name) +
    field('Email', data.email) +
    field('Message', data.message)
  )

  await send({ to: adminEmail, subject: `New lead: ${data.name} — 8Blocks`, html })
}

// 3. Newsletter → user confirmation
export async function sendNewsletterUser(to: string) {
  const html = wrap(
    h1("You're subscribed!") +
    p("You've successfully subscribed to the 8Blocks newsletter. We'll send you insights on token economics, Web3 design patterns, and practical tokenomics — no fluff, just substance.") +
    divider() +
    p('To unsubscribe or manage your preferences, reply to this email with "unsubscribe" in the subject.')
  )

  await send({ to, subject: "You're subscribed to 8Blocks newsletter", html })
}

// 4. Newsletter → admin notification
export async function sendNewsletterAdmin(email: string) {
  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.SMTP_FROM ?? ''
  if (!adminEmail) return

  const html = wrap(
    h1('New newsletter subscriber') +
    field('Email', email)
  )

  await send({ to: adminEmail, subject: `New subscriber: ${email} — 8Blocks`, html })
}
