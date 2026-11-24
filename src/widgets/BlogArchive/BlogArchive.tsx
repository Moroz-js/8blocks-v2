import type { ArticleCard as ArticleCardType } from '@/entities/article'
import { blogArchiveContent as copy } from '@/shared/content/blogPage'
import { uiStrings } from '@/shared/content/uiStrings'
import { ListingEmpty, ListingHeader, ListingPage, Pagination } from '@/widgets/Posts/Listing'
import { PostCard, PostGrid } from '@/widgets/Posts/PostCard'
import { formatPostDate, postMeta } from '@/widgets/Posts/format'

interface Props {
  articles: ArticleCardType[]
  totalPages: number
  currentPage: number
  categoryTitle?: string
  paginationBase?: string
}

export function BlogArchive({ articles, totalPages, currentPage, categoryTitle, paginationBase = '/blog' }: Props) {
  const pageHref = (page: number) => (page <= 1 ? paginationBase : `${paginationBase}?page=${page}`)

  return (
    <ListingPage>
      <ListingHeader title={categoryTitle ?? copy.articlesAndInsights} />

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
