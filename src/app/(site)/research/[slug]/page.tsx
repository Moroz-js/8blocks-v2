import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Article as ArticleType, ArticleCard as ArticleCardType, ArticleSeo, CategoryRef } from '@/entities/article'
import { siteConfig } from '@/shared/config/site'
import {
  visiblePublishedResearchConditions,
} from '@/shared/lib/visible-research-where'
import { mediaToAbsoluteUrl, withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { ArticlePage } from '@/widgets/ArticlePage'
import { ThemeScopeMarker } from '@/shared/lib/ThemeScope'

interface PageProps {
  params: Promise<{ slug: string }>
}

function mapCategoryRef(raw: unknown): CategoryRef | null {
  if (!raw || typeof raw !== 'object') return null
  const item = raw as { id?: unknown; title?: unknown; slug?: unknown }
  if (typeof item.title !== 'string' || typeof item.slug !== 'string') return null
  return { id: String(item.id), title: item.title, slug: item.slug }
}

function mapResearchCard(raw: unknown): ArticleCardType | null {
  if (!raw || typeof raw !== 'object') return null
  const doc = raw as {
    id: unknown
    title?: unknown
    slug?: unknown
    excerpt?: unknown
    cover?: unknown
    category?: unknown
    publishedAt?: unknown
  }
  if (typeof doc.title !== 'string' || typeof doc.slug !== 'string') return null
  const cover = doc.cover && typeof doc.cover === 'object'
    ? (doc.cover as { id?: unknown; url?: unknown; filename?: unknown; alt?: unknown })
    : null
  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    excerpt: typeof doc.excerpt === 'string' ? doc.excerpt : undefined,
    cover: cover
      ? {
          id: String(cover.id),
          url: typeof cover.url === 'string' ? cover.url : `/uploads/${String(cover.filename ?? '')}`,
          alt: typeof cover.alt === 'string' ? cover.alt : doc.title,
        }
      : null,
    category: mapCategoryRef(doc.category),
    publishedAt: typeof doc.publishedAt === 'string' ? doc.publishedAt : null,
  }
}

async function getResearchBySlug(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'research',
    where: {
      and: [{ slug: { equals: slug } }, ...visiblePublishedResearchConditions],
    },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const doc = await getResearchBySlug(slug)
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
  const description = seo.seoDescription ?? (typeof doc.excerpt === 'string' ? doc.excerpt : undefined) ?? siteConfig.description
  const ogTitle = seo.ogTitle ?? title
  const ogDescription = seo.ogDescription ?? description
  const twitterTitle = seo.twitterTitle ?? ogTitle
  const twitterDescription = seo.twitterDescription ?? ogDescription
  const ogImageUrl = mediaToAbsoluteUrl(seo.ogImage) ?? mediaToAbsoluteUrl(doc.cover)

  return withPayloadPageMetadata(`/research/${slug}`, {
    title,
    description,
    alternates: { canonical: `/research/${slug}` },
    robots: seo.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `/research/${slug}`,
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

export default async function ResearchSlugPage({ params }: PageProps) {
  const { slug } = await params
  const doc = await getResearchBySlug(slug)
  if (!doc) notFound()

  const card = mapResearchCard(doc)
  if (!card) notFound()

  const articleFull: ArticleType = {
    ...card,
    content: doc.content,
    tags: [],
    relatedArticles: [],
    status: doc.status as 'draft' | 'published',
    views: typeof doc.views === 'number' ? doc.views : 0,
    seo: (doc.seo as ArticleSeo | undefined) ?? {},
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }

  return (
    <>
      <ThemeScopeMarker />
      <ArticlePage
        article={articleFull}
        relatedArticles={[]}
        basePath="/research"
        trackViews={false}
      />
    </>
  )
}
