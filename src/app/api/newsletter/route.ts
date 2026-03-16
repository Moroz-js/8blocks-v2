import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendNewsletterUser, sendNewsletterAdmin } from '@/shared/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body as { email: string }

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Please enter your email address' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const payload = await getPayload({ config })

    // Check for duplicate — always return success to avoid leaking subscription status
    const existing = await payload.find({
      collection: 'newsletter-subscriptions',
      where: { email: { equals: normalizedEmail } },
      limit: 1,
    })

    if (!existing.docs.length) {
      await payload.create({
        collection: 'newsletter-subscriptions',
        data: { email: normalizedEmail },
      })

      // Send emails — log failures, don't fail request
      try {
        await Promise.all([
          sendNewsletterUser(normalizedEmail),
          sendNewsletterAdmin(normalizedEmail),
        ])
      } catch (emailErr) {
        console.error('[newsletter] email send failed:', emailErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[newsletter]', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
