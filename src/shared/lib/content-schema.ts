import { siteConfig, socialLinks } from '@/shared/config/site'
import { lang } from '@/shared/i18n'

/**
 * schema.org JSON-LD graphs for audit, research, and case pages.
 *
 * Blog articles carry their JSON-LD via `article.seo.headMarkup` (injected in
 * the layout by `getBlogExtraHeadMarkup`). Audits and research have no such
 * per-doc markup wired up, so we generate an equivalent graph in code here from
 * the document fields — this is what AI search / rich results read for
 * attribution (author, dates) and, for audits, the rating (Review).
 */

const BASE = siteConfig.url.replace(/\/$/, '')
const ORG_NAME = siteConfig.name
const ORG_ID = `${BASE}/#organization`
const SITE_ID = `${BASE}/#website`

type Node = Record<string, unknown>

function organizationNode(): Node {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: ORG_NAME,
    url: `${BASE}/`,
    logo: { '@type': 'ImageObject', '@id': `${BASE}/#logo`, url: `${BASE}/logo.png` },
    sameAs: socialLinks.map((s) => s.href),
  }
}

function websiteNode(): Node {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: `${BASE}/`,
    name: ORG_NAME,
    publisher: { '@id': ORG_ID },
    inLanguage: lang,
  }
}

function breadcrumbNode(url: string, sectionLabel: string, sectionPath: string, title: string): Node {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: lang === 'ru' ? 'Главная' : 'Home', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: sectionLabel, item: `${BASE}${sectionPath}` },
      { '@type': 'ListItem', position: 3, name: title },
    ],
  }
}

export interface AuditSchemaInput {
  slug: string
  title: string
  description?: string | null
  imageUrl?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
  expert?: { name?: string | null; role?: string | null; photoUrl?: string | null }
  hero?: { company?: string | null; tokenName?: string | null; score?: number | null; letterRating?: string | null }
}

export function buildAuditGraph(input: AuditSchemaInput): Node {
  const url = `${BASE}/audits/${input.slug}`
  const webpageId = `${url}#webpage`
  const pub = input.publishedAt ?? undefined
  const mod = input.updatedAt ?? input.publishedAt ?? undefined
  const expertName = input.expert?.name?.trim()
  const authorRef = expertName ? { '@id': `${url}#author` } : { '@id': ORG_ID }
  const sectionLabel = lang === 'ru' ? 'Аудиты' : 'Audits'

  const article: Node = {
    '@type': 'Article',
    '@id': `${url}#article`,
    isPartOf: { '@id': webpageId },
    mainEntityOfPage: { '@id': webpageId },
    headline: input.title,
    ...(input.description ? { description: input.description } : {}),
    ...(input.imageUrl ? { image: { '@type': 'ImageObject', url: input.imageUrl, width: 1200, height: 630 } } : {}),
    ...(pub ? { datePublished: pub } : {}),
    ...(mod ? { dateModified: mod } : {}),
    author: authorRef,
    publisher: { '@id': ORG_ID },
    inLanguage: lang,
  }

  const webpage: Node = {
    '@type': 'WebPage',
    '@id': webpageId,
    url,
    name: input.title,
    isPartOf: { '@id': SITE_ID },
    ...(input.imageUrl ? { primaryImageOfPage: { '@type': 'ImageObject', url: input.imageUrl } } : {}),
    ...(pub ? { datePublished: pub } : {}),
    ...(mod ? { dateModified: mod } : {}),
    breadcrumb: { '@id': `${url}#breadcrumb` },
    inLanguage: lang,
  }

  const graph: Node[] = [article, webpage, breadcrumbNode(url, sectionLabel, '/audits', input.title)]

  if (expertName) {
    graph.push({
      '@type': 'Person',
      '@id': `${url}#author`,
      name: expertName,
      ...(input.expert?.role ? { jobTitle: input.expert.role } : {}),
      ...(input.expert?.photoUrl ? { image: input.expert.photoUrl } : {}),
      worksFor: { '@id': ORG_ID },
    })
  }

  // An audit is a third-party review of a token with a numeric score → Review.
  const score = input.hero?.score
  const reviewedName = input.hero?.company?.trim() || input.hero?.tokenName?.trim()
  if (typeof score === 'number' && reviewedName) {
    graph.push({
      '@type': 'Review',
      '@id': `${url}#review`,
      name: input.title,
      itemReviewed: { '@type': 'Product', name: reviewedName },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: score,
        bestRating: 100,
        worstRating: 0,
        ...(input.hero?.letterRating ? { alternateName: input.hero.letterRating } : {}),
      },
      author: { '@id': ORG_ID },
      ...(pub ? { datePublished: pub } : {}),
    })
  }

  graph.push(organizationNode(), websiteNode())
  return { '@context': 'https://schema.org', '@graph': graph }
}

export interface ResearchSchemaInput {
  slug: string
  title: string
  description?: string | null
  imageUrl?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
}

export function buildResearchGraph(input: ResearchSchemaInput): Node {
  const url = `${BASE}/research/${input.slug}`
  const webpageId = `${url}#webpage`
  const pub = input.publishedAt ?? undefined
  const mod = input.updatedAt ?? input.publishedAt ?? undefined
  const sectionLabel = lang === 'ru' ? 'Исследования' : 'Research'

  const article: Node = {
    '@type': 'Article',
    '@id': `${url}#article`,
    isPartOf: { '@id': webpageId },
    mainEntityOfPage: { '@id': webpageId },
    headline: input.title,
    ...(input.description ? { description: input.description } : {}),
    ...(input.imageUrl ? { image: { '@type': 'ImageObject', url: input.imageUrl, width: 1200, height: 630 } } : {}),
    ...(pub ? { datePublished: pub } : {}),
    ...(mod ? { dateModified: mod } : {}),
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: lang,
  }

  const webpage: Node = {
    '@type': 'WebPage',
    '@id': webpageId,
    url,
    name: input.title,
    isPartOf: { '@id': SITE_ID },
    ...(input.imageUrl ? { primaryImageOfPage: { '@type': 'ImageObject', url: input.imageUrl } } : {}),
    ...(pub ? { datePublished: pub } : {}),
    ...(mod ? { dateModified: mod } : {}),
    breadcrumb: { '@id': `${url}#breadcrumb` },
    inLanguage: lang,
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [article, webpage, breadcrumbNode(url, sectionLabel, '/research', input.title), organizationNode(), websiteNode()],
  }
}

export interface CaseSchemaInput {
  slug: string
  title: string
  description?: string | null
  imageUrl?: string | null
  industry?: string | null
  service?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
}

export function buildCasesListGraph(
  cases: Pick<CaseSchemaInput, 'slug' | 'title' | 'description'>[],
): Node {
  const url = `${BASE}/cases`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        '@id': `${url}#item-list`,
        name: lang === 'ru' ? 'Портфолио кейсов' : 'Case study portfolio',
        numberOfItems: cases.length,
        itemListElement: cases.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${url}/${item.slug}`,
          name: item.title,
          ...(item.description ? { description: item.description } : {}),
        })),
      },
      organizationNode(),
      websiteNode(),
    ],
  }
}

export function buildCaseGraph(input: CaseSchemaInput): Node {
  const url = `${BASE}/cases/${input.slug}`
  const webpageId = `${url}#webpage`
  const pub = input.publishedAt ?? undefined
  const mod = input.updatedAt ?? input.publishedAt ?? undefined
  const sectionLabel = lang === 'ru' ? 'Кейсы' : 'Cases'

  const article: Node = {
    '@type': ['Article', 'CreativeWork'],
    '@id': `${url}#case`,
    isPartOf: { '@id': webpageId },
    mainEntityOfPage: { '@id': webpageId },
    headline: input.title,
    name: input.title,
    ...(input.description ? { description: input.description } : {}),
    ...(input.imageUrl
      ? { image: { '@type': 'ImageObject', url: input.imageUrl } }
      : {}),
    ...(input.industry ? { about: input.industry } : {}),
    ...(input.service ? { keywords: [input.service] } : {}),
    ...(pub ? { datePublished: pub } : {}),
    ...(mod ? { dateModified: mod } : {}),
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: lang,
  }

  const webpage: Node = {
    '@type': 'WebPage',
    '@id': webpageId,
    url,
    name: input.title,
    isPartOf: { '@id': SITE_ID },
    ...(input.imageUrl
      ? { primaryImageOfPage: { '@type': 'ImageObject', url: input.imageUrl } }
      : {}),
    ...(pub ? { datePublished: pub } : {}),
    ...(mod ? { dateModified: mod } : {}),
    breadcrumb: { '@id': `${url}#breadcrumb` },
    inLanguage: lang,
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      article,
      webpage,
      breadcrumbNode(url, sectionLabel, '/cases', input.title),
      organizationNode(),
      websiteNode(),
    ],
  }
}
