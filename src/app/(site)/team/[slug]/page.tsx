import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Globe2, Instagram, Mail } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { ArticleCard } from '@/entities/article'
import { ArticleCardUI } from '@/entities/article'
import type { EventCard } from '@/entities/event'
import { EventsPage } from '@/widgets/EventsPage'
import { eventsContent } from '@/shared/content/eventsPage'
import { mapEventCard } from '@/shared/lib/event-mappers'
import { visibleEventWhere } from '@/shared/lib/visible-event-where'
import { visiblePublishedArticleWhere } from '@/shared/lib/visible-article-where'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { EVENT_PLACEHOLDER_IMAGE } from '@/shared/config/events'
import styles from './page.module.scss'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ when?: string; format?: string; city?: string }>
}

async function getAuthor(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'authors',
    where: { and: [{ slug: { equals: slug } }, { showProfile: { equals: true } }] },
    limit: 1,
    depth: 1,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthor(slug)
  if (!author) return { title: 'Not found', robots: { index: false, follow: false } }
  return withPayloadPageMetadata(`/team/${slug}`, {
    title: author.name,
    description: author.bio ?? author.position ?? author.name,
    alternates: { canonical: `/team/${slug}` },
  })
}

function mapArticle(value: unknown): ArticleCard | null {
  const item = value as Record<string, unknown>
  if (!item || typeof item.title !== 'string' || typeof item.slug !== 'string') return null
  const cover = item.cover && typeof item.cover === 'object' ? item.cover as Record<string, unknown> : null
  const category = item.category && typeof item.category === 'object' ? item.category as Record<string, unknown> : null
  return {
    id: String(item.id),
    title: item.title,
    slug: item.slug,
    excerpt: typeof item.excerpt === 'string' ? item.excerpt : undefined,
    cover: cover && typeof cover.url === 'string' ? { id: String(cover.id), url: cover.url, alt: typeof cover.alt === 'string' ? cover.alt : item.title } : null,
    category: category && typeof category.title === 'string' && typeof category.slug === 'string' ? { id: String(category.id), title: category.title, slug: category.slug } : null,
    publishedAt: typeof item.publishedAt === 'string' ? item.publishedAt : null,
  }
}

const profileSocialIcons: Record<string, string> = {
  linkedIn: '/icons/ln-icon.svg',
  telegram: '/icons/tg-icon.svg',
  x: '/icons/x-icon.svg',
}

function ProfileSocialIcon({ id }: { id: string }) {
  const src = profileSocialIcons[id]
  if (src) return <Image src={src} alt="" width={32} height={32} aria-hidden />
  if (id === 'instagram') return <Instagram size={32} aria-hidden />
  if (id === 'email') return <Mail size={32} aria-hidden />
  return <Globe2 size={32} aria-hidden />
}

function ProfileSocials({ author }: { author: Record<string, unknown> }) {
  const links = ['instagram', 'x', 'telegram', 'linkedIn', 'website', 'email'].flatMap((id) => {
    const value = author[id]
    if (typeof value !== 'string' || !value) return []
    return [{ id, href: id === 'email' ? `mailto:${value}` : value }]
  })
  if (!links.length) return null
  return <div className={styles.socials}>{links.map((link) => <a key={link.id} href={link.href} aria-label={link.id} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}><ProfileSocialIcon id={link.id} /></a>)}</div>
}

export default async function TeamMemberPage({ params, searchParams }: PageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const author = await getAuthor(slug)
  if (!author) notFound()
  const payload = await getPayload({ config })
  const [eventResult, articleResult] = await Promise.all([
    payload.find({ collection: 'events', where: visibleEventWhere, limit: 1000, depth: 2, sort: 'startsAt' }),
    payload.find({ collection: 'articles', where: visiblePublishedArticleWhere, limit: 1000, depth: 1, sort: '-publishedAt' }),
  ])
  const events = eventResult.docs
    .filter((doc) => {
      const rows = (doc as unknown as { representatives?: { person?: { id?: unknown } | unknown }[] }).representatives
      return Array.isArray(rows) && rows.some((row) =>
        row.person && typeof row.person === 'object' && String((row.person as { id?: unknown }).id) === String(author.id))
    })
    .map(mapEventCard)
    .filter((event): event is EventCard => event !== null)
  const articles = articleResult.docs
    .filter((doc) => Array.isArray(doc.author) && doc.author.some((item) => typeof item === 'object' && item && String(item.id) === String(author.id)))
    .map(mapArticle)
    .filter((article): article is ArticleCard => article !== null)
  const timing = query.when === 'past' ? 'past' : 'upcoming'
  const format = query.format === 'online' ? 'online' : 'offline'

  return (
    <div className={styles.root}>
      <header className={styles.profile}>
        <Image src={(author.photo as { url?: string } | null)?.url ?? EVENT_PLACEHOLDER_IMAGE} alt={author.name} width={256} height={256} priority />
        <div className={styles.profileInfo}>
          <h1>{author.name}</h1>
          {author.position && <p className={styles.position}>{author.position}</p>}
          {author.bio && <p className={styles.bio}>{author.bio}</p>}
          <ProfileSocials author={author as unknown as Record<string, unknown>} />
        </div>
      </header>
      <EventsPage events={events} timing={timing} format={format} city={query.city} basePath={`/team/${slug}`} title={eventsContent.profileEvents(author.name)} embedded />
      {articles.length > 0 && <section className={styles.articles}>
        <h2>{eventsContent.profileArticles(author.name)}</h2>
        <div>{articles.map((article, index) => <ArticleCardUI key={article.id} article={article} index={index} />)}</div>
      </section>}
    </div>
  )
}
