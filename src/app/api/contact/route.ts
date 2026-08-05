import { after } from 'next/server'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload, ValidationError } from 'payload'
import config from '@payload-config'
import { sendContactAdmin } from '@/shared/lib/email'
import { sanitizeContactForm } from '@/shared/lib/form-sanitize'

export async function POST(req: NextRequest) {
  try {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    const parsed = sanitizeContactForm(body)
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    const { name, email, message } = parsed

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'leads',
      data: {
        name,
        email,
        message,
      },
    })

    // Ответ сразу (без долгого await SMTP), но отправка дожимается через after() —
    // иначе void Promise без after часто обрывается вместе с завершением запроса Next.js.
    // Юзеру confirmation не шлём — только уведомление админу.
    after(async () => {
      try {
        await sendContactAdmin({ name, email, message })
      } catch (err) {
        console.error('[contact] email (admin notify) failed:', err)
      }
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
    console.error('[contact form]', error)
    return NextResponse.json({ error: 'Failed to send. Please try again.' }, { status: 500 })
  }
}
