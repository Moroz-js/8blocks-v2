import { AccentSurface, Button, Cta, Section } from '@/shared/ds'
import { home } from '@/shared/content/home'
import { uiStrings } from '@/shared/content/uiStrings'
import { BinaryGlyph } from '@/widgets/BinaryArt/BinaryGlyph'
import { ServiceHero } from '@/widgets/ServicePages/blocks/ServiceHero'
import { PartnersMarquee } from '@/widgets/ServicePages/blocks/PartnersMarquee'
import { IndexedRows, SplitList } from '@/widgets/ServicePages/blocks/SplitList'
import { PostCard, PostGrid } from '@/widgets/Posts/PostCard'
import { formatPostDate, postMeta } from '@/widgets/Posts/format'
import { getLatestArticles } from '@/widgets/Posts/getLatestArticles'
import styles from './HomePage.module.scss'

const ChevronRight = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** Home page on design system v2 (project 2 «Home»). */
export async function HomePage({ blogEnabled }: { blogEnabled: boolean }) {
  const posts = blogEnabled ? await getLatestArticles(3) : []
  return (
    <>
      <ServiceHero scene="hand-coin" title={home.hero.title} description={home.hero.description}>
        <Button href={home.hero.action.href}>{home.hero.action.label}</Button>
      </ServiceHero>

      <div className={styles.tags} aria-hidden="true">
        <div className={styles.tagsTrack}>
          {[0, 1].map((copy) => (
            <div key={copy} className={styles.tagsGroup}>
              {[...home.tags, ...home.tags].map((tag, i) => (
                <span key={i} className={styles.tag}>
                  {tag}
                  <span className={styles.dot} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Section title={home.services.title} sheen>
        <ul className={styles.services}>
          {home.services.items.map((item) => (
            <li key={item.href} className={styles.service}>
              <div className={styles.serviceArt} aria-hidden="true">
                <BinaryGlyph shape={item.shape} os={0.85} />
              </div>
              <div className={styles.serviceText}>
                <h3 className={styles.serviceTitle}>{item.title}</h3>
                <p className={styles.serviceDescription}>{item.description}</p>
              </div>
              <Button variant="secondary" href={item.href} fullWidth>
                {home.services.more}
              </Button>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={home.about.title} align="center">
        <div className={styles.about}>
          <dl className={styles.stats} data-accent-group>
            {home.about.stats.map((stat) => (
              <div key={stat.value} className={styles.stat}>
                <AccentSurface />
                <dt className={styles.statValue}>{stat.value}</dt>
                <dd className={styles.statLabel}>{stat.label}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.offices}>{home.about.offices}</p>
        </div>
      </Section>

      <PartnersMarquee label={home.partnersLabel} />

      <SplitList title={home.why.title}>
        <IndexedRows items={home.why.items} />
      </SplitList>

      {posts.length > 0 && (
        <Section
          title={home.blog.title}
          sheen
          actions={
            <Button variant="secondary" href={home.blog.all.href} icon={ChevronRight}>
              {home.blog.all.label}
            </Button>
          }
        >
          <PostGrid>
            {posts.map((post, i) => (
              <PostCard
                key={post.id}
                href={`/blog/${post.slug}`}
                cover={post.cover ? { url: post.cover.url, alt: post.cover.alt } : null}
                meta={postMeta(post.category?.title, formatPostDate(post.publishedAt))}
                title={post.title}
                excerpt={post.excerpt}
                footer={`${post.readingTime} ${uiStrings.minutes}`}
                action={`${uiStrings.read} →`}
                priority={i === 0}
              />
            ))}
          </PostGrid>
        </Section>
      )}

      <Section>
        <Cta size="md" title={home.cta.title} description={home.cta.description} primary={home.cta.action} />
      </Section>
    </>
  )
}
