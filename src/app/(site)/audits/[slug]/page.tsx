import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { siteConfig } from '@/shared/config/site'
import { visiblePublicAuditWhere } from '@/shared/lib/public-audit-where'
import { mediaToAbsoluteUrl, withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { AuditPage } from '@/widgets/AuditPage'
import { ThemeScopeMarker } from '@/shared/lib/ThemeScope'
import { buildAuditGraph } from '@/shared/lib/content-schema'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ print?: string }>
}

function mapMedia(raw: unknown, fallbackAlt: string): { url: string; alt: string } | null {
  if (!raw || typeof raw !== 'object') return null
  const m = raw as { url?: unknown; filename?: unknown; alt?: unknown }
  const url =
    typeof m.url === 'string' ? m.url : `/uploads/${String(m.filename ?? '')}`
  return { url, alt: typeof m.alt === 'string' ? m.alt : fallbackAlt }
}

async function getAuditBySlug(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'public-audits',
    where: {
      and: [{ slug: { equals: slug } }, visiblePublicAuditWhere],
    },
    limit: 1,
    // depth 2: populate expert.author relationship together with the author's photo
    depth: 2,
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

export default async function AuditSlugPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const sp = searchParams ? await searchParams : {}
  const print = sp.print === '1' || sp.print === 'true'

  const doc = await getAuditBySlug(slug)
  if (!doc) notFound()

  const cover = doc.cover && typeof doc.cover === 'object' ? doc.cover : null
  const heroRaw = (doc.hero && typeof doc.hero === 'object' ? doc.hero : {}) as Record<
    string,
    unknown
  >
  const heroMetrics = Array.isArray(doc.heroMetrics)
    ? (doc.heroMetrics as { label?: unknown; value?: unknown }[]).map((m) => ({
        label: String(m.label ?? ''),
        value: String(m.value ?? ''),
      }))
    : []

  const ratingBlocks = Array.isArray(doc.ratingBlocks)
    ? (doc.ratingBlocks as { block?: unknown; weight?: unknown; scoreFive?: unknown }[]).map(
        (b) => ({
          block: String(b.block ?? ''),
          weight: Number(b.weight ?? 0),
          scoreFive: Number(b.scoreFive ?? 0),
        }),
      )
    : []

  const expertRaw = (doc.expert && typeof doc.expert === 'object' ? doc.expert : {}) as Record<
    string,
    unknown
  >
  const expertAuthor = (
    expertRaw.author && typeof expertRaw.author === 'object' ? expertRaw.author : {}
  ) as Record<string, unknown>

  const auditJsonLd = buildAuditGraph({
    slug: doc.slug,
    title: doc.title,
    description: typeof doc.excerpt === 'string' ? doc.excerpt : null,
    imageUrl: mediaToAbsoluteUrl(doc.cover) ?? null,
    publishedAt: doc.publishedAt ? String(doc.publishedAt) : null,
    updatedAt: doc.updatedAt ? String(doc.updatedAt) : null,
    expert: {
      name: typeof expertRaw.name === 'string' ? expertRaw.name : null,
      role: typeof expertRaw.role === 'string' ? expertRaw.role : null,
      photoUrl: mediaToAbsoluteUrl(expertRaw.photo) ?? null,
    },
    hero: {
      company: typeof heroRaw.company === 'string' ? heroRaw.company : null,
      tokenName: typeof heroRaw.tokenName === 'string' ? heroRaw.tokenName : null,
      score: typeof heroRaw.score === 'number' ? heroRaw.score : null,
      letterRating: typeof heroRaw.letterRating === 'string' ? heroRaw.letterRating : null,
    },
  })

  return (
    <>
      <ThemeScopeMarker />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(auditJsonLd) }} />
      <AuditPage
        print={print}
        audit={{
          title: doc.title,
          slug: doc.slug,
          excerpt: typeof doc.excerpt === 'string' ? doc.excerpt : null,
          hero: {
            company: (heroRaw.company as string) ?? null,
            tokenName: (heroRaw.tokenName as string) ?? null,
            tokenStandard: (heroRaw.tokenStandard as string) ?? null,
            projectDescription: (heroRaw.projectDescription as string) ?? null,
            site: (heroRaw.site as string) ?? null,
            metrics: heroMetrics,
            verdict: (heroRaw.verdict as string) ?? null,
            strength: (heroRaw.strength as string) ?? null,
            weakness: (heroRaw.weakness as string) ?? null,
            letterRating: (heroRaw.letterRating as string) ?? null,
            score: typeof heroRaw.score === 'number' ? heroRaw.score : null,
          },
          ratingBlocks,
          expert: {
            name: (expertAuthor.name as string) ?? null,
            role: (expertAuthor.position as string) ?? null,
            linkedIn: (expertAuthor.linkedIn as string) ?? null,
            rating: (expertRaw.rating as string) ?? null,
            photo: mapMedia(expertAuthor.photo, (expertAuthor.name as string) ?? doc.title),
          },
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
    </>
  )
}
