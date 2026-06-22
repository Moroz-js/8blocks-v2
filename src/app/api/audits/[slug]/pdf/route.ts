import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { visiblePublicAuditWhere } from '@/shared/lib/public-audit-where'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function internalBaseUrl(): string {
  if (process.env.PDF_INTERNAL_BASE_URL) return process.env.PDF_INTERNAL_BASE_URL
  const port = process.env.PORT || '3000'
  return `http://127.0.0.1:${port}`
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  // Validate the audit exists and is visible before spinning up Chromium.
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'public-audits',
      where: { and: [{ slug: { equals: slug } }, visiblePublicAuditWhere] },
      limit: 1,
      depth: 0,
    })
    if (!result.docs.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  const targetUrl = `${internalBaseUrl()}/audits/${encodeURIComponent(slug)}?print=1`

  let browser: import('puppeteer').Browser | null = null
  try {
    const puppeteer = (await import('puppeteer')).default
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    })

    const page = await browser.newPage()
    await page.emulateMediaType('print')
    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 60_000 })

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '12mm', bottom: '14mm', left: '10mm', right: '10mm' },
    })

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${slug}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('PDF generation failed:', err)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  } finally {
    if (browser) await browser.close()
  }
}
