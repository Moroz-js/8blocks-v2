import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BlogArchive } from '@/widgets/BlogArchive'
import type { ArticleCard as ArticleCardType, CategoryRef } from '@/entities/article'
import { estimateReadingTime } from '@/entities/article'

export const metadata: Metadata = {
  title: 'Блог — 8Blocks',
  description: 'Статьи о токеномике, экономике Web3 и дизайне токенов от команды 8Blocks.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Блог — 8Blocks',
    description: 'Статьи о токеномике, экономике Web3 и дизайне токенов от команды 8Blocks.',
    url: '/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Блог — 8Blocks',
    description: 'Статьи о токеномике, экономике Web3 и дизайне токенов от команды 8Blocks.',
  },
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
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: ARTICLES_PER_PAGE,
    page: currentPage,
    depth: 1,
  })

  // Fetch all categories for the filter nav
  const categoriesResult = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'title',
  })

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

  const categories: CategoryRef[] = categoriesResult.docs.map((doc) => ({
    id:    String(doc.id),
    title: doc.title,
    slug:  doc.slug,
  }))

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
