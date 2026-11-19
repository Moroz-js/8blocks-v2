import type { MediaMentionCard } from '@/entities/media-mention'
import type { CategoryRef } from '@/entities/article'
import { lang } from '@/shared/i18n'
import { mediaArchiveContent as copy } from '@/shared/content/mediaPage'
import { FilterChips, ListingEmpty, ListingHeader, ListingPage, Pagination } from '@/widgets/Posts/Listing'
import { PostCard, PostGrid } from '@/widgets/Posts/PostCard'
import { formatPostDate, postMeta } from '@/widgets/Posts/format'

interface Props {
  mentions: MediaMentionCard[]
  categories: CategoryRef[]
  totalPages: number
  currentPage: number
  totalDocs: number
  activeCategory?: string | null
}

const OUTLETS: Record<string, string> = { beincrypto: 'BeInCrypto', cointelegraph: 'Cointelegraph', forklog: 'ForkLog', rbc: 'РБК' }

/** «Read on BeInCrypto»: the outlet comes from the publication URL. */
function outletName(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return OUTLETS[host.split('.')[0]] ?? host
  } catch {
    return ''
  }
}

function countLabel(count: number) {
  if (lang === 'ru') {
    const mod10 = count % 10
    const mod100 = count % 100
    if (mod10 === 1 && mod100 !== 11) return copy.countSingular
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return copy.countFew
    return copy.countMany
  }
  return count === 1 ? copy.countSingular : copy.countMany
}

/** Press listing on design system v2 (project 2 «Press»). */
export function MediaArchive({ mentions, categories, totalPages, currentPage, totalDocs, activeCategory = null }: Props) {
  const pageHref = (page: number) => {
    const base = activeCategory ? `/press?cat=${activeCategory}` : '/press'
    if (page <= 1) return base
    return `${base}${activeCategory ? '&' : '?'}page=${page}`
  }

  return (
    <ListingPage>
      <ListingHeader title={copy.headline} subtitle={totalDocs > 0 ? `${totalDocs} ${countLabel(totalDocs)}` : undefined}>
        {categories.length > 0 && (
          <FilterChips
            label={copy.filterByCategory}
            items={[
              { label: copy.filterAll, href: '/press', active: !activeCategory },
              ...categories.map((cat) => ({ label: cat.title, href: `/press?cat=${cat.slug}`, active: activeCategory === cat.slug })),
            ]}
          />
        )}
      </ListingHeader>

      {mentions.length > 0 ? (
        <PostGrid>
          {mentions.map((mention, i) => {
            const outlet = outletName(mention.url)
            return (
              <PostCard
                key={mention.id}
                href={mention.url}
                external
                cover={mention.cover ? { url: mention.cover.url, alt: mention.cover.alt } : null}
                title={mention.title}
                excerpt={mention.excerpt}
                footer={postMeta(mention.category?.title, formatPostDate(mention.publishedAt))}
                action={outlet ? `${copy.readOn} ${outlet}` : copy.readLink}
                priority={i < 3}
              />
            )
          })}
        </PostGrid>
      ) : (
        <ListingEmpty title={copy.emptyState} hint={copy.emptyHint} />
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
