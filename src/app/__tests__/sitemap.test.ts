import type { MetadataRoute } from 'next'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Коллекции Payload: даты фиксированы, чтобы проверять, что lastmod берётся из контента.
const AUDITS = [
  { slug: 'mantra-om', updatedAt: '2026-10-01T10:00:00.000Z', seo: {} },
  { slug: 'tether-gold', updatedAt: '2026-10-20T10:00:00.000Z', seo: {} },
  { slug: 'hidden-one', updatedAt: '2026-11-05T10:00:00.000Z', seo: { noindex: true } },
]
const CASES = [
  { slug: 'hadronica', updatedAt: '2026-09-15T10:00:00.000Z', seo: {}, format: 'full' },
  // mini-кейс своей страницы не имеет, но на листинге /cases показывается.
  { slug: 'tibiti', updatedAt: '2026-10-05T10:00:00.000Z', seo: {}, format: 'mini' },
]
const RESEARCH = [{ slug: 'correlation-study', updatedAt: '2026-08-02T10:00:00.000Z', seo: {} }]
const EVENTS = [{ slug: 'token2049', updatedAt: '2026-07-07T10:00:00.000Z', seo: {} }]
const ARTICLES = [
  { slug: 'clarity-act', updatedAt: '2026-10-28T10:00:00.000Z', seo: {}, category: { id: 'c-defi' } },
  { slug: 'listing-on-dexs', updatedAt: '2026-06-01T10:00:00.000Z', seo: {}, category: 'c-nft' },
]
const PRESS = [{ updatedAt: '2026-11-02T10:00:00.000Z' }, { updatedAt: '2026-05-01T10:00:00.000Z' }]
const LAUNCH_MODULES = [{ updatedAt: '2026-04-09T10:00:00.000Z' }]

const DOCS_BY_COLLECTION: Record<string, unknown[]> = {
  'public-audits': AUDITS,
  cases: CASES,
  research: RESEARCH,
  events: EVENTS,
  articles: ARTICLES,
  'media-mentions': PRESS,
  'launch-modules': LAUNCH_MODULES,
}
vi.mock('payload', () => ({
  getPayload: async () => ({
    find: async ({ collection }: { collection: string }) => ({
      docs: DOCS_BY_COLLECTION[collection] ?? [],
    }),
  }),
}))
vi.mock('@payload-config', () => ({ default: {} }))
vi.mock('@/shared/lib/getBlogEnabled', () => ({ getBlogEnabled: async () => true }))
vi.mock('@/shared/lib/getResearchEnabled', () => ({ getResearchEnabled: async () => true }))
vi.mock('@/shared/lib/getPublicAuditsEnabled', () => ({ getPublicAuditsEnabled: async () => true }))
vi.mock('@/shared/lib/getEventsEnabled', () => ({ getEventsEnabled: async () => true }))
vi.mock('@/shared/lib/blog-nav-categories', () => ({
  getNonEmptyBlogCategories: async () => [
    { id: 'c-defi', title: 'DeFi', slug: 'defi' },
    { id: 'c-nft', title: 'NFT', slug: 'nft-assets' },
  ],
}))

import sitemap from '../sitemap'

function lastmodOf(entries: MetadataRoute.Sitemap, suffix: string): string {
  const entry = entries.find((item) => item.url.endsWith(suffix))
  if (!entry) throw new Error(`URL ${suffix} отсутствует в sitemap`)
  return new Date(entry.lastModified as string | Date).toISOString()
}

describe('sitemap', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  it('отдаёт одинаковый lastmod при повторных запросах', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-09T12:00:00.000Z'))
    const first = await sitemap()

    vi.setSystemTime(new Date('2026-11-12T18:30:00.000Z'))
    const second = await sitemap()

    expect(first.length).toBeGreaterThan(20)
    expect(first).toHaveLength(second.length)
    const firstDates = first.map((entry) => `${entry.url} ${new Date(entry.lastModified as string | Date).toISOString()}`)
    const secondDates = second.map((entry) => `${entry.url} ${new Date(entry.lastModified as string | Date).toISOString()}`)
    expect(secondDates).toEqual(firstDates)
  })

  it('не помечает страницы временем запроса', async () => {
    vi.useFakeTimers()
    const requestTime = new Date('2026-11-09T12:00:00.000Z')
    vi.setSystemTime(requestTime)

    const entries = await sitemap()

    expect(entries.length).toBeGreaterThan(20)
    const stamped = entries.filter(
      (entry) =>
        Math.abs(new Date(entry.lastModified as string | Date).getTime() - requestTime.getTime()) <
        60_000,
    )
    expect(stamped).toEqual([])
  })

  it('датирует листинги свежайшим элементом коллекции', async () => {
    const entries = await sitemap()

    expect(lastmodOf(entries, '/audits')).toBe('2026-10-20T10:00:00.000Z')
    expect(lastmodOf(entries, '/research')).toBe('2026-08-02T10:00:00.000Z')
    expect(lastmodOf(entries, '/events')).toBe('2026-07-07T10:00:00.000Z')
    expect(lastmodOf(entries, '/blog')).toBe('2026-10-28T10:00:00.000Z')
    expect(lastmodOf(entries, '/press')).toBe('2026-11-02T10:00:00.000Z')
  })

  it('датирует главную и /product/token-launch их контентом из CMS', async () => {
    const entries = await sitemap()

    expect(lastmodOf(entries, '8blocks.io')).toBe('2026-10-28T10:00:00.000Z')
    expect(lastmodOf(entries, '/product/token-launch')).toBe('2026-04-09T10:00:00.000Z')
  })

  it('датирует /cases и mini-кейсом, но страницу заводит только для full', async () => {
    const entries = await sitemap()

    expect(lastmodOf(entries, '/cases')).toBe('2026-10-05T10:00:00.000Z')
    expect(entries.some((entry) => entry.url.endsWith('/cases/hadronica'))).toBe(true)
    expect(entries.some((entry) => entry.url.endsWith('/cases/tibiti'))).toBe(false)
  })

  it('датирует рубрику блога её свежайшей статьёй', async () => {
    const entries = await sitemap()

    expect(lastmodOf(entries, '/blog/defi')).toBe('2026-10-28T10:00:00.000Z')
    expect(lastmodOf(entries, '/blog/nft-assets')).toBe('2026-06-01T10:00:00.000Z')
  })

  it('не выдаёт noindex-страницы', async () => {
    const entries = await sitemap()

    expect(entries.some((entry) => entry.url.endsWith('/audits/hidden-one'))).toBe(false)
    expect(entries.some((entry) => entry.url.endsWith('/audits/mantra-om'))).toBe(true)
  })
})
