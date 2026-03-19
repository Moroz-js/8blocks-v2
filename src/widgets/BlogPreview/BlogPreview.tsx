import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { ArticleCard } from '@/entities/article'
import { estimateReadingTime } from '@/entities/article'
import { ArticleCardUI } from '@/entities/article'
import styles from './BlogPreview.module.scss'

async function getLatestArticles(): Promise<ArticleCard[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 3,
      depth: 1,
    })
    return result.docs.map((doc) => ({
      id: String(doc.id),
      title: doc.title as string,
      slug: doc.slug as string,
      excerpt: (doc.excerpt as string | undefined) ?? undefined,
      cover: doc.cover && typeof doc.cover === 'object' && 'url' in doc.cover
        ? {
            id: String((doc.cover as { id: unknown }).id),
            url: (doc.cover as { url: string }).url,
            alt: (doc.cover as { alt?: string }).alt ?? '',
          }
        : null,
      category: doc.category && typeof doc.category === 'object' && 'slug' in doc.category
        ? {
            id: String((doc.category as { id: unknown }).id),
            title: (doc.category as { title: string }).title,
            slug: (doc.category as { slug: string }).slug,
          }
        : null,
      publishedAt: (doc.publishedAt as string | undefined) ?? null,
      readingTime: estimateReadingTime(doc.content),
    }))
  } catch {
    return []
  }
}

export async function BlogPreview() {
  const articles = await getLatestArticles()
  if (articles.length === 0) return null

  return (
    <section className={styles.section} id="blog">
      {/* Header */}
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.label}>[ Блог ]</span>
            <h2 className={styles.headline}>
              Блог о
              <br className={styles.br} />
              токеномике
            </h2>
          </div>
          <div className={styles.headerRight}>
            <Link href="/blog" className={styles.allLink}>
              Все статьи
              <span className={styles.allArrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {articles.map((article, i) => (
            <div key={article.id} className={styles.cardWrap}>
              <ArticleCardUI article={article} index={i} priority={i === 0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
