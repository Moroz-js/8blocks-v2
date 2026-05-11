import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { MediaArchive } from '@/widgets/MediaArchive'
import type { MediaMentionCard } from '@/entities/media-mention'
import type { CategoryRef } from '@/entities/article'
import { mediaMeta } from '@/shared/content/mediaPage'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/media', {
    title: mediaMeta.title,
    description: mediaMeta.description,
    alternates: { canonical: '/media' },
    openGraph: {
      title: mediaMeta.ogTitle,
      description: mediaMeta.ogDescription,
      url: '/media',
    },
    twitter: {
      card: 'summary_large_image',
      title: mediaMeta.ogTitle,
      description: mediaMeta.ogDescription,
    },
  })
}

const MENTIONS_PER_PAGE = 9

interface PageProps {
  searchParams: Promise<{ page?: string; cat?: string }>
}

export default async function MediaPage({ searchParams }: PageProps) {
  const { page: pageParam, cat } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const payload = await getPayload({ config })

  // Build where filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {}
  if (cat) {
    const catResult = await payload.find({
      collection: 'media-categories',
      where: { slug: { equals: cat } },
      limit: 1,
    })
    if (catResult.docs[0]) {
      where['category'] = { equals: catResult.docs[0].id }
    }
  }

  const mentionsResult = await payload.find({
    collection: 'media-mentions',
    where,
    sort: '-featured,-publishedAt',
    limit: MENTIONS_PER_PAGE,
    page: currentPage,
    depth: 1,
  })

  const categoriesResult = await payload.find({
    collection: 'media-categories',
    limit: 100,
    sort: 'title',
  })

  const mentions: MediaMentionCard[] = mentionsResult.docs.map((doc) => {
    const cover = doc.cover && typeof doc.cover === 'object' ? doc.cover : null
    const category = doc.category && typeof doc.category === 'object' ? doc.category : null

    return {
      id: String(doc.id),
      title: doc.title,
      url: doc.url,
      excerpt: doc.excerpt ?? null,
      cover: cover
        ? {
            id: String(cover.id),
            url: cover.url ?? `/uploads/${cover.filename}`,
            alt: (cover.alt as string) || doc.title,
          }
        : null,
      category: category
        ? {
            id: String(category.id),
            title: category.title,
            slug: category.slug,
          }
        : null,
      publishedAt: String(doc.publishedAt),
      featured: doc.featured ?? false,
    }
  })

  const categories: CategoryRef[] = categoriesResult.docs.map((doc) => ({
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
  }))

  return (
    <MediaArchive
      mentions={mentions}
      categories={categories}
      totalPages={mentionsResult.totalPages}
      currentPage={currentPage}
      totalDocs={mentionsResult.totalDocs}
      activeCategory={cat ?? null}
    />
  )
}
