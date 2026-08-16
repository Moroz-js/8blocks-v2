import { cache } from 'react'
import { buildDefaultRobotsTxt } from './default-robots-txt'
import { getSiteSeoGlobal } from './get-site-seo'

export const getRobotsTxtContent = cache(async (): Promise<string> => {
  if (process.env.NEXT_PUBLIC_STAGING === 'true') {
    return ['User-agent: *', 'Disallow: /', ''].join('\n')
  }

  const global = await getSiteSeoGlobal()
  const custom = global?.robotsTxt?.trim()
  return custom || buildDefaultRobotsTxt()
})
