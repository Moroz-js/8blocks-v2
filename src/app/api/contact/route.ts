import { NextRequest, NextResponse } from 'next/server'
import { getPayload, ValidationError } from 'payload'
import config from '@payload-config'
import { sendContactUser, sendContactAdmin } from '@/shared/lib/email'
import { sanitizeContactForm } from '@/shared/lib/form-sanitize'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
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
        source: 'footer-form',
        status: 'new',
      },
    })

    // Send emails — log failures but don't fail the request
    try {
      await Promise.all([
        sendContactUser(email, { name, email, message }),
        sendContactAdmin({ name, email, message }),
      ])
    } catch (emailErr) {
      console.error('[contact] email send failed:', emailErr)
    }

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
