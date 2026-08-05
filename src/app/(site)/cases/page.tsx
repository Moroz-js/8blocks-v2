import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import type {
  CaseCardData,
  CaseCategory,
  CaseFormat,
  CaseService,
} from '@/entities/case-study'
import { siteConfig } from '@/shared/config/site'
import { casesMeta } from '@/shared/content/casesPage'
import { buildCasesListGraph } from '@/shared/lib/content-schema'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { visibleCaseWhere } from '@/shared/lib/visible-case-where'
import { CasesPage } from '@/widgets/CasesPage'

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/cases', {
    title: casesMeta.title,
    description: casesMeta.description,
    alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/cases` },
    openGraph: {
      title: casesMeta.ogTitle,
      description: casesMeta.ogDescription,
      url: '/cases',
    },
  })
}

function mapCover(raw: unknown, fallbackAlt: string) {
  if (!raw || typeof raw !== 'object') return null
  const media = raw as {
    url?: unknown
    filename?: unknown
    alt?: unknown
  }
  const url =
    typeof media.url === 'string'
      ? media.url
      : media.filename
        ? `/uploads/${String(media.filename)}`
        : null
  if (!url) return null
  return {
    url,
    alt: typeof media.alt === 'string' ? media.alt : fallbackAlt,
  }
}

function mapCaseCategory(value: unknown): CaseCategory | null {
  return value === 'DeFi' ||
    value === 'GameFi' ||
    value === 'RWA' ||
    value === 'Finance'
    ? value
    : null
}

function mapCaseCard(raw: unknown): CaseCardData | null {
  if (!raw || typeof raw !== 'object') return null
  const doc = raw as Record<string, unknown>
  if (
    typeof doc.id !== 'number' &&
    typeof doc.id !== 'string'
  ) return null
  if (
    typeof doc.title !== 'string' ||
    typeof doc.slug !== 'string' ||
    typeof doc.task !== 'string'
  ) return null

  const overview =
    doc.overview && typeof doc.overview === 'object'
      ? (doc.overview as Record<string, unknown>)
      : {}
  const solution =
    doc.solution && typeof doc.solution === 'object'
      ? (doc.solution as Record<string, unknown>)
      : {}
  const result =
    doc.result && typeof doc.result === 'object'
      ? (doc.result as Record<string, unknown>)
      : {}

  const actions = [solution.stepOne, solution.stepTwo, solution.stepThree].filter(
    (item): item is string => typeof item === 'string' && item.trim().length > 0,
  )

  return {
    id: String(doc.id),
    slug: doc.slug,
    format: doc.format === 'full' ? 'full' : ('mini' as CaseFormat),
    title: doc.title,
    category: mapCaseCategory(overview.industry),
    industry: typeof overview.industry === 'string' ? overview.industry : null,
    service:
      doc.service === 'design' || doc.service === 'audit' || doc.service === 'advisory'
        ? (doc.service as CaseService)
        : null,
    cover: mapCover(doc.cover, doc.title),
    task: doc.task,
    actions,
    result: typeof result.summary === 'string' ? result.summary : '',
    metricValue: typeof result.metricValue === 'string' ? result.metricValue : null,
    metricLabel: typeof result.metricLabel === 'string' ? result.metricLabel : null,
  }
}

export default async function CasesPageRoute() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'cases',
    where: visibleCaseWhere,
    sort: 'sortOrder',
    limit: 200,
    depth: 1,
  })
  const cases = result.docs
    .map(mapCaseCard)
    .filter((item): item is CaseCardData => item !== null)
  const jsonLd = buildCasesListGraph(
    cases.map((item) => ({
      slug: item.slug,
      title: item.title,
      description: item.result || item.task,
    })),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CasesPage cases={cases} />
    </>
  )
}
