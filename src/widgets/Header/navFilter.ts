import type { SiteNav } from '@/shared/content/siteNav'

/** Sections toggled in the CMS / site config; disabled ones drop out of the navigation. */
export interface NavFlags {
  blogEnabled?: boolean
  researchEnabled?: boolean
  eventsEnabled?: boolean
  mediaEnabled?: boolean
  auditsEnabled?: boolean
  digitalAssetsEnabled?: boolean
}

const FLAG_BY_HREF: Record<string, keyof NavFlags> = {
  '/blog': 'blogEnabled',
  '/research': 'researchEnabled',
  '/events': 'eventsEnabled',
  '/press': 'mediaEnabled',
  '/audits': 'auditsEnabled',
  '/product/digital-assets': 'digitalAssetsEnabled',
}

export function filterNav(nav: SiteNav, flags: NavFlags): SiteNav {
  const visible = (href: string) => {
    const flag = FLAG_BY_HREF[href]
    return !flag || flags[flag] !== false
  }
  return {
    ...nav,
    groups: nav.groups
      .map((group) => ({
        ...group,
        columns: group.columns
          .map((column) => ({ ...column, links: column.links.filter((link) => visible(link.href)) }))
          .filter((column) => column.links.length > 0),
      }))
      .filter((group) => group.columns.length > 0),
  }
}
