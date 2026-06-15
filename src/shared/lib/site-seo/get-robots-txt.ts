import { cache } from 'react'
import { buildDefaultRobotsTxt } from './default-robots-txt'
import { getSiteSeoGlobal } from './get-site-seo'

export const getRobotsTxtContent = cache(async (): Promise<string> => {
  const global = await getSiteSeoGlobal()
  const custom = global?.robotsTxt?.trim()
  return custom || buildDefaultRobotsTxt()
})
