import { siteConfig } from '@/shared/config/site'
import { lang } from '@/shared/i18n'
import { organizationNode, websiteNode, ORG_ID, SITE_ID } from './content-schema'

/**
 * schema.org JSON-LD for static / product pages (Service, FAQPage, Dataset,
 * SoftwareApplication, ItemList, AboutPage, CollectionPage …).
 *
 * Every graph carries WebPage + BreadcrumbList + Organization + WebSite and
 * links nodes by `@id` (`#webpage`, `#breadcrumb`, `#faq`, …) so it composes
 * with the audit/research/case graphs in `content-schema.ts`.
 */

const BASE = siteConfig.url.replace(/\/$/, '')

export type Node = Record<string, unknown>
export type FaqItem = { question: string; answer: string }
export type Crumb = { name: string; path: string }

const HOME = lang === 'ru' ? 'Главная' : 'Home'

export function absUrl(path: string): string {
  return path === '/' ? `${BASE}/` : `${BASE}${path}`
}

export function breadcrumbListNode(path: string, crumbs: Crumb[]): Node {
  const url = absUrl(path)
  const items = [{ name: HOME, path: '/' }, ...crumbs]
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absUrl(c.path),
    })),
  }
}

export function faqPageNode(path: string, items: FaqItem[]): Node | null {
  const clean = items.filter((i) => i.question?.trim() && i.answer?.trim())
  if (clean.length === 0) return null
  return {
    '@type': 'FAQPage',
    '@id': `${absUrl(path)}#faq`,
    mainEntity: clean.map((i) => ({
      '@type': 'Question',
      name: i.question.trim(),
      acceptedAnswer: { '@type': 'Answer', text: i.answer.trim() },
    })),
  }
}

export interface PageGraphInput {
  path: string
  name: string
  description?: string | null
  /** WebPage subtype: AboutPage, CollectionPage, ContactPage, … */
  pageType?: string
  crumbs: Crumb[]
  faq?: FaqItem[] | null
  /** Extra nodes (Service, Dataset, ItemList …). Use `#webpage` ids to link. */
  extra?: Node[]
  datePublished?: string | null
  dateModified?: string | null
}

export function buildPageGraph(input: PageGraphInput): Node {
  const url = absUrl(input.path)
  const webpageId = `${url}#webpage`
  const webpage: Node = {
    '@type': input.pageType ?? 'WebPage',
    '@id': webpageId,
    url,
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
    breadcrumb: { '@id': `${url}#breadcrumb` },
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    inLanguage: lang,
  }
  const graph: Node[] = [webpage, breadcrumbListNode(input.path, input.crumbs)]
  const faq = input.faq ? faqPageNode(input.path, input.faq) : null
  if (faq) graph.push(faq)
  if (input.extra) graph.push(...input.extra)
  graph.push(organizationNode(), websiteNode())
  return { '@context': 'https://schema.org', '@graph': graph }
}

/** Consulting service offered by the organisation on this page. */
export function serviceNode(path: string, opts: { name: string; serviceType: string; description?: string | null; audience?: string | null }): Node {
  const url = absUrl(path)
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: opts.name,
    serviceType: opts.serviceType,
    ...(opts.description ? { description: opts.description } : {}),
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Place', name: lang === 'ru' ? 'Весь мир' : 'Worldwide' },
    ...(opts.audience ? { audience: { '@type': 'BusinessAudience', name: opts.audience } } : {}),
    url,
    mainEntityOfPage: { '@id': `${url}#webpage` },
  }
}

/** Free or paid web tool (assessment, calculator, AI sprint). */
export function webAppNode(
  path: string,
  opts: {
    name: string
    description?: string | null
    type?: 'WebApplication' | 'SoftwareApplication'
    category?: string
    price?: number
    currency?: string
    availability?: 'InStock' | 'PreOrder'
  },
): Node {
  const url = absUrl(path)
  return {
    '@type': opts.type ?? 'WebApplication',
    '@id': `${url}#app`,
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    url,
    applicationCategory: opts.category ?? 'BusinessApplication',
    operatingSystem: 'Web',
    ...((opts.type ?? 'WebApplication') === 'WebApplication' ? { browserRequirements: 'Requires JavaScript' } : {}),
    provider: { '@id': ORG_ID },
    offers: {
      '@type': 'Offer',
      price: opts.price ?? 0,
      priceCurrency: opts.currency ?? 'USD',
      availability: `https://schema.org/${opts.availability ?? 'InStock'}`,
      url,
    },
  }
}

export type Citation = { title: string; url: string }

/** Benchmark / research table published on the page. */
export function datasetNode(
  path: string,
  opts: {
    name: string
    description: string
    variableMeasured?: string[]
    temporalCoverage?: string
    citations?: Citation[]
    keywords?: string[]
    dateModified?: string | null
  },
): Node {
  const url = absUrl(path)
  return {
    '@type': 'Dataset',
    '@id': `${url}#dataset`,
    name: opts.name,
    description: opts.description,
    url,
    creator: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    inLanguage: lang,
    ...(opts.temporalCoverage ? { temporalCoverage: opts.temporalCoverage } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    ...(opts.keywords?.length ? { keywords: opts.keywords } : {}),
    ...(opts.variableMeasured?.length
      ? { variableMeasured: opts.variableMeasured.map((v) => ({ '@type': 'PropertyValue', name: v })) }
      : {}),
    ...(opts.citations?.length
      ? { citation: opts.citations.map((c) => ({ '@type': 'CreativeWork', name: c.title, url: c.url })) }
      : {}),
    mainEntityOfPage: { '@id': `${url}#webpage` },
  }
}

export type ListEntry = {
  name: string
  description?: string | null
  url?: string | null
  itemType?: string
  datePublished?: string | null
  citation?: Citation | null
}

/** Curated list rendered on the page (case library, press mentions, category archive). */
export function itemListNode(path: string, name: string, entries: ListEntry[]): Node {
  const url = absUrl(path)
  return {
    '@type': 'ItemList',
    '@id': `${url}#list`,
    name,
    numberOfItems: entries.length,
    itemListOrder: 'https://schema.org/ItemListUnordered',
    itemListElement: entries.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': e.itemType ?? 'CreativeWork',
        name: e.name,
        ...(e.description ? { description: e.description } : {}),
        ...(e.url ? { url: e.url } : {}),
        ...(e.datePublished ? { datePublished: e.datePublished } : {}),
        ...(e.citation ? { citation: { '@type': 'CreativeWork', name: e.citation.title, url: e.citation.url } } : {}),
      },
    })),
  }
}

/** Organisation facts for /about — merges into the shared `#organization` node by id. */
export function aboutOrganizationNode(): Node {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    foundingDate: '2017',
    url: `${BASE}/`,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: { '@type': 'PostalAddress', streetAddress: siteConfig.address },
    knowsAbout:
      lang === 'ru'
        ? ['Токеномика', 'Дизайн токен-экономики', 'Аудит токеномики', 'Web3-стратегия', 'Токенизация активов']
        : ['Tokenomics', 'Token economy design', 'Tokenomics audit', 'Web3 strategy', 'Asset tokenization'],
  }
}
