import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Article as ArticleType, ArticleCard as ArticleCardType, CategoryRef } from '@/entities/article'
import { estimateReadingTime } from '@/entities/article'
import { siteConfig } from '@/shared/config/site'
import { ArticlePage } from '@/widgets/ArticlePage'
import { BlogArchive } from '@/widgets/BlogArchive'

const ARTICLES_PER_PAGE = 9

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

function mapCategoryRef(raw: unknown): CategoryRef | null {
  if (!raw || typeof raw !== 'object') return null
  if (!('id' in raw) || !('title' in raw) || !('slug' in raw)) return null

  const item = raw as { id: unknown; title: unknown; slug: unknown }
  if (typeof item.title !== 'string' || typeof item.slug !== 'string') return null

  return {
    id: String(item.id),
    title: item.title,
    slug: item.slug,
  }
}

function mapArticleCard(raw: unknown): ArticleCardType | null {
  if (!raw || typeof raw !== 'object') return null

  const doc = raw as {
    id: unknown
    title?: unknown
    slug?: unknown
    excerpt?: unknown
    cover?: unknown
    category?: unknown
    publishedAt?: unknown
    content?: unknown
  }

  if (typeof doc.title !== 'string' || typeof doc.slug !== 'string') return null

  const cover = doc.cover && typeof doc.cover === 'object' ? (doc.cover as {
    id?: unknown
    url?: unknown
    filename?: unknown
    alt?: unknown
  }) : null

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
    readingTime: estimateReadingTime(doc.content),
  }
}

async function getPublishedArticleBySlug(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'articles',
    where: {
      and: [
        { slug: { equals: slug } },
        { status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 2,
  })

  return result.docs[0] ?? null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const articleDoc = await getPublishedArticleBySlug(slug)
  if (articleDoc) {
    const seo = (articleDoc.seo as { seoTitle?: string; seoDescription?: string; noindex?: boolean } | undefined) ?? {}
    const title = seo.seoTitle ?? articleDoc.title
    const description = seo.seoDescription ?? articleDoc.excerpt ?? siteConfig.description

    return {
      title,
      description,
      alternates: { canonical: `/blog/${slug}` },
      robots: seo.noindex ? { index: false, follow: false } : undefined,
      openGraph: {
        title,
        description,
        url: `/blog/${slug}`,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    }
  }

  const categoryResult = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const category = categoryResult.docs[0]
  if (!category) {
    return {
      title: 'Page not found',
      robots: { index: false, follow: false },
    }
  }

  const seo = (category.seo as { seoTitle?: string; seoDescription?: string } | undefined) ?? {}
  const title = seo.seoTitle ?? `${category.title} — Blog`
  const description = seo.seoDescription ?? category.description ?? siteConfig.description

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function BlogSlugPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const payload = await getPayload({ config })

  // Slug priority: article first, then category
  const articleDoc = await getPublishedArticleBySlug(slug)
  if (articleDoc) {
    const article = mapArticleCard(articleDoc)
    if (!article) notFound()

    const relatedRaw = Array.isArray(articleDoc.relatedArticles) ? articleDoc.relatedArticles : []
    const relatedArticles = relatedRaw
      .map((item) => mapArticleCard(item))
      .filter((item): item is ArticleCardType => item !== null)

    const articleFull: ArticleType = {
      ...article,
      content: articleDoc.content,
      tags: [],
      relatedArticles,
      status: articleDoc.status as 'draft' | 'published',
      views: typeof articleDoc.views === 'number' ? articleDoc.views : 0,
      seo: (articleDoc.seo as { seoTitle?: string; seoDescription?: string; noindex?: boolean } | undefined) ?? {},
      createdAt: articleDoc.createdAt,
      updatedAt: articleDoc.updatedAt,
    }

    return <ArticlePage article={articleFull} relatedArticles={relatedArticles} />
  }

  const categoryResult = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const category = categoryResult.docs[0]
  if (!category) notFound()

  const articlesResult = await payload.find({
    collection: 'articles',
    where: {
      and: [
        { status: { equals: 'published' } },
        { category: { equals: category.id } },
      ],
    },
    sort: '-publishedAt',
    limit: ARTICLES_PER_PAGE,
    page: currentPage,
    depth: 1,
  })

  const categoriesResult = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'title',
  })

  const articles = articlesResult.docs
    .map((doc) => mapArticleCard(doc))
    .filter((item): item is ArticleCardType => item !== null)

  const categories: CategoryRef[] = categoriesResult.docs.map((doc) => ({
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
  }))

  return (
    <BlogArchive
      articles={articles}
      categories={categories}
      totalPages={articlesResult.totalPages}
      currentPage={currentPage}
      totalDocs={articlesResult.totalDocs}
      activeCategory={category.slug}
      categoryTitle={category.title}
      paginationBase={`/blog/${category.slug}`}
    />
  )
}
