import { getPayload } from 'payload'
import config from '@payload-config'
import { visibleEventConditions } from '@/shared/lib/visible-event-where'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function icsDate(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function icsText(value: string) {
  return value.replace(/([,;\\])/g, '\\$1').replace(/\r?\n/g, '\\n')
}

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'events',
    where: { and: [{ slug: { equals: slug } }, ...visibleEventConditions] },
    limit: 1,
    depth: 1,
  })
  const event = result.docs[0]
  if (!event) return new Response('Not found', { status: 404 })

  const item = event as unknown as Record<string, unknown>
  const startsAt = String(item.startsAt)
  const endsAt = typeof item.endsAt === 'string'
    ? item.endsAt
    : new Date(new Date(startsAt).getTime() + 60 * 60 * 1000).toISOString()
  const city = item.city && typeof item.city === 'object' ? item.city as Record<string, unknown> : null
  const location = [item.venueName, city?.name, city?.country].filter((value): value is string => typeof value === 'string').join(', ')
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://8blocks.io').replace(/\/$/, '')
  const contents = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//8Blocks//Events//EN',
    'BEGIN:VEVENT',
    `UID:${icsText(String(item.id))}@8blocks.io`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(startsAt)}`,
    `DTEND:${icsDate(endsAt)}`,
    `SUMMARY:${icsText(String(item.title))}`,
    ...(location ? [`LOCATION:${icsText(location)}`] : []),
    `URL:${base}/events/${encodeURIComponent(slug)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n')

  return new Response(contents, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${slug}.ics"`,
    },
  })
}
