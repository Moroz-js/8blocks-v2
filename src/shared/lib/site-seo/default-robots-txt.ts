import { siteConfig } from '@/shared/config/site'

const BASE = siteConfig.url.replace(/\/$/, '')

/** Стандартный robots.txt, если в CMS поле пустое. */
export function buildDefaultRobotsTxt(): string {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api',
    '',
    `Sitemap: ${BASE}/sitemap.xml`,
  ].join('\n')
}
