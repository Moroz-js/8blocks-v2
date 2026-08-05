import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type {
  CaseDetailData,
  CaseCategory,
  CaseFormat,
  CaseService,
} from '@/entities/case-study'
import { siteConfig } from '@/shared/config/site'
import { buildCaseGraph } from '@/shared/lib/content-schema'
import { visibleFullCaseWhere } from '@/shared/lib/visible-case-where'
import { mediaToAbsoluteUrl, withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { CaseDetailPage } from '@/widgets/CaseDetailPage'

interface PageProps {
  params: Promise<{ slug: string }>
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

async function getCaseBySlug(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'cases',
    where: {
      and: [{ slug: { equals: slug } }, visibleFullCaseWhere],
    },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ?? null
}

function mapCaseDetail(raw: unknown): CaseDetailData | null {
  if (!raw || typeof raw !== 'object') return null
  const doc = raw as Record<string, unknown>
  if (
    (typeof doc.id !== 'number' && typeof doc.id !== 'string') ||
    typeof doc.title !== 'string' ||
    typeof doc.slug !== 'string' ||
    typeof doc.task !== 'string' ||
    typeof doc.updatedAt !== 'string'
  ) {
    return null
  }

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
  const relatedArticle =
    doc.relatedArticle && typeof doc.relatedArticle === 'object'
      ? (doc.relatedArticle as Record<string, unknown>)
      : null
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
    clientGoals:
      typeof overview.clientGoals === 'string' ? overview.clientGoals : null,
    service:
      doc.service === 'design' || doc.service === 'audit' || doc.service === 'advisory'
        ? (doc.service as CaseService)
        : null,
    cover: mapCover(doc.cover, doc.title),
    task: doc.task,
    challenge: typeof doc.challenge === 'string' ? doc.challenge : null,
    actions,
    result: typeof result.summary === 'string' ? result.summary : '',
    metricValue: typeof result.metricValue === 'string' ? result.metricValue : null,
    metricLabel: typeof result.metricLabel === 'string' ? result.metricLabel : null,
    content: doc.content ?? null,
    relatedArticleSlug:
      relatedArticle && typeof relatedArticle.slug === 'string'
        ? relatedArticle.slug
        : null,
    relatedArticleTitle:
      relatedArticle && typeof relatedArticle.title === 'string'
        ? relatedArticle.title
        : null,
    publishedAt: typeof doc.publishedAt === 'string' ? doc.publishedAt : null,
    updatedAt: doc.updatedAt,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const doc = await getCaseBySlug(slug)
  if (!doc) {
    return { title: 'Not found', robots: { index: false, follow: false } }
  }

  const seo =
    (doc.seo as {
      seoTitle?: string
      seoDescription?: string
      noindex?: boolean
      ogTitle?: string
      ogDescription?: string
      ogImage?: unknown
    } | undefined) ?? {}
  const result =
    doc.result && typeof doc.result === 'object'
      ? (doc.result as { summary?: string })
      : {}
  const title = seo.seoTitle ?? doc.title
  const description =
    seo.seoDescription ?? result.summary ?? doc.task ?? siteConfig.description
  const ogTitle = seo.ogTitle ?? title
  const ogDescription = seo.ogDescription ?? description
  const ogImageUrl = mediaToAbsoluteUrl(seo.ogImage) ?? mediaToAbsoluteUrl(doc.cover)

  return withPayloadPageMetadata(`/cases/${slug}`, {
    title,
    description,
    alternates: { canonical: `/cases/${slug}` },
    robots: seo.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `/cases/${slug}`,
      type: 'article',
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  })
}

export default async function CaseSlugPage({ params }: PageProps) {
  const { slug } = await params
  const doc = await getCaseBySlug(slug)
  if (!doc) notFound()

  const item = mapCaseDetail(doc)
  if (!item) notFound()

  const jsonLd = buildCaseGraph({
    slug: item.slug,
    title: item.title,
    description: item.result || item.task,
    imageUrl: mediaToAbsoluteUrl(doc.cover) ?? null,
    industry: item.industry,
    service: item.service,
    publishedAt: item.publishedAt,
    updatedAt: item.updatedAt,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseDetailPage item={item} />
    </>
  )
}
