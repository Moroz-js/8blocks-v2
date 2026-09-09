import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { visiblePublicAuditWhere } from '@/shared/lib/public-audit-where'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PDF_VIEWPORT_WIDTH = 1200

/** Готовые PDF хранятся на диске; ключ = slug + updatedAt документа, так что правка аудита инвалидирует кэш. */
const AUDIT_PDF_CACHE_DIR =
  process.env.AUDIT_PDF_CACHE_DIR || path.join(process.cwd(), '.cache', 'audit-pdf')

/** Дубликат HTML-страницы аудита — из индекса исключаем, ссылки внутри не передают вес. */
const PDF_HEADERS = {
  'Content-Type': 'application/pdf',
  'X-Robots-Tag': 'noindex, nofollow',
  'Cache-Control': 'public, max-age=3600',
} as const

/** Один рендер на slug за раз: параллельные запросы ждут общий результат, а не поднимают по Chromium каждый. */
const inflight = new Map<string, Promise<Buffer>>()

function cacheKey(slug: string, updatedAt: string): string {
  const h = createHash('sha1').update(`${slug}|${updatedAt}`).digest('hex').slice(0, 12)
  return `${slug}-${h}.pdf`
}

/** Page-break / chrome-hide CSS injected while staying on *screen* media
 * so layout matches the desktop page. Charts use fixed px sizes (recharts 2). */
const PDF_LAYOUT_CSS = `
@page { size: A4 portrait; margin: 0; }
/* Slightly shorter first page so hero+takeaways fill it without a huge black void. */
@page :first { size: 297mm 185mm; margin: 0; }

html, body {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

header,
footer,
#__replain_widget,
[id*="replain"],
[data-no-print],
body > div[aria-hidden="true"],
body::before {
  display: none !important;
}

[data-pdf-cover] {
  break-after: page !important;
  page-break-after: always !important;
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* Hero: more internal padding to fill cover height. */
[data-audit-hero] {
  margin-top: 0 !important;
  padding-top: 40px !important;
  padding-bottom: 28px !important;
  flex-shrink: 0;
}

[data-audit-hero] [class*="description"] {
  margin-top: 28px !important;
}

[data-audit-hero] [class*="metricsBand"] {
  margin-top: 40px !important;
  padding-top: 28px !important;
  padding-bottom: 20px !important;
}

/* Takeaways vertically centered in remaining space under hero. */
[data-pdf-takeaways] {
  flex: 1 1 auto !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  padding-top: 24px !important;
  padding-bottom: 32px !important;
}

[data-pdf-takeaways] > div {
  grid-template-columns: repeat(3, 1fr) !important;
  width: 100%;
}

[data-pdf-rating] {
  break-before: page !important;
  page-break-before: always !important;
}

[data-pdf-rating] [class*="topGrid"],
[data-pdf-rating-profile] {
  display: grid !important;
  grid-template-columns: 1fr !important;
  gap: 16px !important;
  margin-bottom: 0 !important;
  break-inside: avoid !important;
  page-break-inside: avoid !important;
}

/* Compact profile + detailing so both fit on one portrait page. */
[data-pdf-rating-profile] [class*="card"] {
  padding: 16px 20px !important;
  break-inside: avoid !important;
  page-break-inside: avoid !important;
}

[data-pdf-rating-profile] [class*="cardTitle"] {
  margin-bottom: 8px !important;
}

[data-pdf-rating-profile] [class*="radarWrap"] {
  height: 300px !important;
}

[data-pdf-rating-profile] [class*="bars"] {
  gap: 10px !important;
  padding-top: 4px !important;
  break-inside: avoid !important;
  page-break-inside: avoid !important;
}

[data-pdf-rating-profile] [class*="barTrack"] {
  height: 6px !important;
}

[data-pdf-detail-bars],
[data-pdf-detail-bars] .bars {
  break-inside: avoid !important;
  page-break-inside: avoid !important;
}

[data-pdf-rating-tail] {
  break-before: page !important;
  page-break-before: always !important;
}

[data-pdf-rating] [class*="ratingBox"] {
  padding: 28px 32px 28px 28px !important;
}

[data-pdf-rating] [class*="scoreLine"] {
  padding-right: 8px !important;
}

[data-pdf-chart],
[data-pdf-chart] .recharts-wrapper,
[data-pdf-chart] .recharts-surface,
.tableWrap,
table {
  break-inside: avoid !important;
  page-break-inside: avoid !important;
}

table tr, table thead, table tbody, table tfoot {
  break-inside: avoid !important;
  page-break-inside: avoid !important;
}

.recharts-surface,
.recharts-surface * {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
`

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

  let updatedAt = ''
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
    updatedAt = String((result.docs[0] as { updatedAt?: string }).updatedAt ?? '')
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  const file = path.join(AUDIT_PDF_CACHE_DIR, cacheKey(slug, updatedAt))
  const headers = { ...PDF_HEADERS, 'Content-Disposition': `attachment; filename="${slug}.pdf"` }

  try {
    const cached = await readFile(file)
    return new NextResponse(new Uint8Array(cached), { status: 200, headers })
  } catch {
    /* cache miss */
  }

  let job = inflight.get(file)
  if (!job) {
    job = renderPdf(slug)
      .then(async (buf) => {
        await mkdir(AUDIT_PDF_CACHE_DIR, { recursive: true })
        await writeFile(file, buf)
        return buf
      })
      .finally(() => inflight.delete(file))
    inflight.set(file, job)
  }

  try {
    const pdf = await job
    return new NextResponse(new Uint8Array(pdf), { status: 200, headers })
  } catch (err) {
    console.error('PDF generation failed:', err)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}

async function renderPdf(slug: string): Promise<Buffer> {
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
        '--font-render-hinting=none',
      ],
    })

    const page = await browser.newPage()
    await page.setViewport({
      width: PDF_VIEWPORT_WIDTH,
      height: 900,
      deviceScaleFactor: 1,
    })

    // Stay on screen media — charts measure correctly; PDF page rules come from injected CSS.
    await page.emulateMediaType('screen')
    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 60_000 })
    await page.addStyleTag({ content: PDF_LAYOUT_CSS })

    await page.evaluate(async () => {
      await (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready
      window.dispatchEvent(new Event('resize'))
    })
    await new Promise((r) => setTimeout(r, 600))

    await page
      .waitForFunction(
        () => {
          const charts = document.querySelectorAll('[data-pdf-chart]')
          if (charts.length === 0) return true
          return Array.from(charts).every((chart) => {
            // Legend icons also use .recharts-surface (tiny) — only the plot counts.
            const surface =
              chart.querySelector('.recharts-wrapper > .recharts-surface') ||
              Array.from(chart.querySelectorAll('.recharts-surface')).find(
                (s) => s.getBoundingClientRect().width > 80,
              )
            if (!surface) return false
            const box = surface.getBoundingClientRect()
            return box.width > 80 && box.height > 80
          })
        },
        { timeout: 15_000 },
      )
      .catch(() => null)

    // One more resize after layout CSS, then brief settle.
    await page.evaluate(() => window.dispatchEvent(new Event('resize')))
    await new Promise((r) => setTimeout(r, 400))

    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      scale: 1,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    })

    return Buffer.from(pdf)
  } finally {
    if (browser) await browser.close()
  }
}
