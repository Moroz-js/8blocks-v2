import { NextRequest, NextResponse } from 'next/server'
import { getPayload, ValidationError } from 'payload'
import config from '@payload-config'
import { BANNED_EMAILS } from '@/shared/config/banned-emails'
import { PUBLIC_FORM_ERRORS, sanitizeNewsletterEmail } from '@/shared/lib/form-sanitize'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = sanitizeNewsletterEmail(body)
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    const normalizedEmail = parsed.email
    if (BANNED_EMAILS.has(normalizedEmail)) {
      return NextResponse.json({ error: 'This email address cannot be used.' }, { status: 400 })
    }

    const rawSource = (body as Record<string, unknown>).source
    const source =
      typeof rawSource === 'string' && rawSource.trim()
        ? rawSource.replace(/\0/g, '').replace(/[\r\n]+/g, ' ').trim().slice(0, 200)
        : undefined

    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'newsletter-subscriptions',
      where: { email: { equals: normalizedEmail } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      // Для email-гейта (source задан) повторная подписка — не ошибка:
      // пользователь должен получить файл, адрес уже сохранён.
      if (source) {
        return NextResponse.json({ success: true, already: true })
      }
      return NextResponse.json(
        { error: PUBLIC_FORM_ERRORS.newsletterDuplicateEmail },
        { status: 400 },
      )
    }

    await payload.create({
      collection: 'newsletter-subscriptions',
      data: { email: normalizedEmail, ...(source ? { source } : {}) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof ValidationError) {
      const first = error.data?.errors?.[0]?.message
      return NextResponse.json(
        { error: first ?? 'Please check your input and try again.' },
        { status: 400 },
      )
    }
    console.error('[newsletter]', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
