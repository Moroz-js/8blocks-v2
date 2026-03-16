import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendContactUser, sendContactAdmin } from '@/shared/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, message } = body as { name: string; email: string; message: string }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'leads',
      data: {
        name:    name.trim(),
        email:   email.trim().toLowerCase(),
        message: message.trim(),
        source:  'footer-form',
        status:  'new',
      },
    })

    // Send emails — log failures but don't fail the request
    try {
      await Promise.all([
        sendContactUser(email.trim(), { name: name.trim(), email: email.trim(), message: message.trim() }),
        sendContactAdmin({ name: name.trim(), email: email.trim(), message: message.trim() }),
      ])
    } catch (emailErr) {
      console.error('[contact] email send failed:', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[contact form]', error)
    return NextResponse.json({ error: 'Failed to send. Please try again.' }, { status: 500 })
  }
}
