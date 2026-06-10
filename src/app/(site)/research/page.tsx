import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ResearchArchive } from '@/widgets/ResearchArchive'
import type { ResearchCard } from '@/entities/research'
import { researchMeta } from '@/shared/content/researchPage'
import { visiblePublishedResearchWhere } from '@/shared/lib/visible-research-where'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/research', {
    title: researchMeta.title,
    description: researchMeta.description,
    alternates: { canonical: '/research' },
    openGraph: {
      title: researchMeta.ogTitle,
      description: researchMeta.ogDescription,
      url: '/research',
    },
    twitter: {
      card: 'summary_large_image',
      title: researchMeta.ogTitle,
      description: researchMeta.ogDescription,
    },
  })
}

const RESEARCH_PER_PAGE = 8

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function ResearchPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'research',
    where: visiblePublishedResearchWhere,
    sort: '-publishedAt',
    limit: RESEARCH_PER_PAGE,
    page: currentPage,
    depth: 1,
  })

  const research: ResearchCard[] = result.docs.map((doc) => {
    const cover = doc.cover && typeof doc.cover === 'object' ? doc.cover : null
    const category = doc.category && typeof doc.category === 'object' ? doc.category : null

    return {
      id: String(doc.id),
      title: doc.title,
      slug: doc.slug,
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
      cardColor: typeof doc.cardColor === 'string' ? doc.cardColor : null,
      textColor: typeof doc.textColor === 'string' ? doc.textColor : null,
      publishedAt: doc.publishedAt ?? null,
      views: typeof doc.views === 'number' ? doc.views : 0,
    }
  })

  return (
    <ResearchArchive
      research={research}
      totalPages={result.totalPages}
      currentPage={currentPage}
      totalDocs={result.totalDocs}
    />
  )
}
