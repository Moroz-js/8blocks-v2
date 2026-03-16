import type { ArticleCard } from '@/entities/article'
import { ArticleCardUI } from '@/entities/article'
import styles from './RelatedArticles.module.scss'

interface Props {
  articles: ArticleCard[]
}

export function RelatedArticles({ articles }: Props) {
  if (!articles.length) return null

  return (
    <section className={styles.root}>
      <p className={styles.label}>
        <span className={styles.bracket}>[</span>
        Read more
        <span className={styles.bracket}>]</span>
      </p>
      <div className={styles.grid}>
        {articles.map((article, i) => (
          <ArticleCardUI
            key={article.id}
            article={article}
            index={i}
            priority={false}
          />
        ))}
      </div>
    </section>
  )
}
