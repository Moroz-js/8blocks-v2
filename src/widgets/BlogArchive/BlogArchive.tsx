import type { ArticleCard as ArticleCardType, CategoryRef } from '@/entities/article'
import { blogArchiveContent as copy } from '@/shared/content/blogPage'
import { uiStrings } from '@/shared/content/uiStrings'
import { FilterChips, ListingEmpty, ListingHeader, ListingPage, Pagination } from '@/widgets/Posts/Listing'
import { PostCard, PostGrid } from '@/widgets/Posts/PostCard'
import { formatPostDate, postMeta } from '@/widgets/Posts/format'

interface Props {
  articles: ArticleCardType[]
  categories: CategoryRef[]
  totalPages: number
  currentPage: number
  totalDocs: number
  activeCategory?: string | null
  /** If set, the archive shows this category name as headline */
  categoryTitle?: string
  /** Base href for pagination links, e.g. /blog or /blog/defi */
  paginationBase?: string
}

/** Blog listing on design system v2 (project 2 «Blog»). */
export function BlogArchive({
  articles,
  categories,
  totalPages,
  currentPage,
  activeCategory = null,
  categoryTitle,
  paginationBase = '/blog',
}: Props) {
  const pageHref = (page: number) => (page <= 1 ? paginationBase : `${paginationBase}?page=${page}`)

  return (
    <ListingPage>
      <ListingHeader title={categoryTitle ?? copy.articlesAndInsights}>
        {categories.length > 0 && (
          <FilterChips
            label={copy.filterByCategory}
            items={[
              { label: copy.filterAll, href: '/blog', active: !activeCategory },
              ...categories.map((cat) => ({ label: cat.title, href: `/blog/${cat.slug}`, active: activeCategory === cat.slug })),
            ]}
          />
        )}
      </ListingHeader>

      {articles.length > 0 ? (
        <PostGrid>
          {articles.map((article, i) => (
            <PostCard
              key={article.id}
              href={`/blog/${article.slug}`}
              cover={article.cover ? { url: article.cover.url, alt: article.cover.alt } : null}
              meta={postMeta(article.category?.title, formatPostDate(article.publishedAt))}
              title={article.title}
              excerpt={article.excerpt}
              footer={`${article.readingTime} ${uiStrings.minRead}`}
              action={`${uiStrings.read} →`}
              priority={i < 3}
            />
          ))}
        </PostGrid>
      ) : (
        <ListingEmpty title={copy.emptyCategory} hint={copy.emptyHint} />
      )}

      <Pagination
        current={currentPage}
        total={totalPages}
        href={pageHref}
        labels={{ nav: copy.paginationAriaLabel, prev: copy.prevPage, next: copy.nextPage }}
      />
    </ListingPage>
  )
}
