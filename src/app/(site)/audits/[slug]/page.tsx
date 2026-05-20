import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { siteConfig } from '@/shared/config/site'
import { visiblePublicAuditWhere } from '@/shared/lib/public-audit-where'
import { mediaToAbsoluteUrl, withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { AuditPage } from '@/widgets/AuditPage'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getAuditBySlug(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'public-audits',
    where: {
      and: [{ slug: { equals: slug } }, visiblePublicAuditWhere],
    },
    limit: 1,
    depth: 1,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const doc = await getAuditBySlug(slug)

  if (!doc) {
    return { title: 'Not found', robots: { index: false, follow: false } }
  }

  const seo = (doc.seo as {
    seoTitle?: string
    seoDescription?: string
    noindex?: boolean
    ogTitle?: string
    ogDescription?: string
    ogImage?: unknown
    twitterTitle?: string
    twitterDescription?: string
  } | undefined) ?? {}

  const title = seo.seoTitle ?? doc.title
  const description = seo.seoDescription ?? doc.excerpt ?? siteConfig.description
  const ogTitle = seo.ogTitle ?? title
  const ogDescription = seo.ogDescription ?? description
  const twitterTitle = seo.twitterTitle ?? ogTitle
  const twitterDescription = seo.twitterDescription ?? ogDescription
  const ogImageUrl = mediaToAbsoluteUrl(seo.ogImage) ?? mediaToAbsoluteUrl(doc.cover)

  return withPayloadPageMetadata(`/audits/${slug}`, {
    title,
    description,
    alternates: { canonical: `/audits/${slug}` },
    robots: seo.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `/audits/${slug}`,
      type: 'article',
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  })
}

export default async function AuditSlugPage({ params }: PageProps) {
  const { slug } = await params
  const doc = await getAuditBySlug(slug)
  if (!doc) notFound()

  const cover = doc.cover && typeof doc.cover === 'object' ? doc.cover : null
  const metrics = doc.metrics && typeof doc.metrics === 'object' ? doc.metrics : null

  return (
    <AuditPage
      audit={{
        title: doc.title,
        slug: doc.slug,
        excerpt: doc.excerpt ?? null,
        metrics: metrics
          ? {
              companyName: metrics.companyName ?? null,
              tokenName: metrics.tokenName ?? null,
              tokenStandard: metrics.tokenStandard ?? null,
              fdv: metrics.fdv ?? null,
              mc: metrics.mc ?? null,
              tvl: metrics.tvl ?? null,
              fees: metrics.fees ?? null,
              users: metrics.users ?? null,
              unlock: metrics.unlock ?? null,
              retail: metrics.retail ?? null,
              rating: metrics.rating ?? null,
              ratingScore: metrics.ratingScore ?? null,
            }
          : null,
        cover: cover
          ? {
              url: cover.url ?? `/uploads/${cover.filename}`,
              alt: (cover.alt as string) || doc.title,
            }
          : null,
        content: doc.content,
        relatedArticleSlug:
          doc.relatedArticle && typeof doc.relatedArticle === 'object'
            ? (doc.relatedArticle as { slug?: string }).slug ?? null
            : null,
        ctaText: doc.ctaText ?? null,
        publishedAt: doc.publishedAt ? String(doc.publishedAt) : null,
      }}
    />
  )
}
