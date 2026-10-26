import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BlogArchive } from '@/widgets/BlogArchive'
import type { ArticleCard as ArticleCardType } from '@/entities/article'
import { estimateReadingTime } from '@/entities/article'
import { blogMeta } from '@/shared/content/blogPage'
import { visiblePublishedArticleWhere } from '@/shared/lib/visible-article-where'
import { paginatedListingSeo, withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { getNonEmptyBlogCategories } from '@/shared/lib/blog-nav-categories'

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { page } = await searchParams
  const listing = paginatedListingSeo('/blog', page)
  return withPayloadPageMetadata('/blog', {
    title: `${blogMeta.title}${listing.titleSuffix}`,
    description: blogMeta.description,
    alternates: { canonical: listing.canonical },
    openGraph: {
      title: blogMeta.ogTitle,
      description: blogMeta.ogDescription,
      url: listing.canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title: blogMeta.ogTitle,
      description: blogMeta.ogDescription,
    },
  }, listing.hreflang)
}

const ARTICLES_PER_PAGE = 9

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const payload = await getPayload({ config })

  // Fetch published articles (paginated)
  const articlesResult = await payload.find({
    collection: 'articles',
    where: visiblePublishedArticleWhere,
    sort: '-publishedAt',
    limit: ARTICLES_PER_PAGE,
    page: currentPage,
    depth: 1,
  })

  // Filter nav: only categories that have published articles
  const categories = await getNonEmptyBlogCategories(payload)

  // Map Payload docs → ArticleCard type
  const articles: ArticleCardType[] = articlesResult.docs.map((doc) => {
    const cover = doc.cover && typeof doc.cover === 'object' ? doc.cover : null
    const category = doc.category && typeof doc.category === 'object' ? doc.category : null

    return {
      id:          String(doc.id),
      title:       doc.title,
      slug:        doc.slug,
      excerpt:     doc.excerpt ?? undefined,
      cover:       cover
        ? {
            id:  String(cover.id),
            url: cover.url ?? `/uploads/${cover.filename}`,
            alt: (cover.alt as string) || doc.title,
          }
        : null,
      category:    category
        ? {
            id:    String(category.id),
            title: category.title,
            slug:  category.slug,
          }
        : null,
      publishedAt: doc.publishedAt ?? null,
      readingTime: estimateReadingTime(doc.content),
    }
  })

  return (
    <BlogArchive
      articles={articles}
      categories={categories}
      totalPages={articlesResult.totalPages}
      currentPage={currentPage}
      totalDocs={articlesResult.totalDocs}
    />
  )
}
