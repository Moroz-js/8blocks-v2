import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { SiteSeoGlobalDoc, SiteSeoPageOverride } from './types'
import { normalizeContentPath } from './normalize-path'

export const getSiteSeoGlobal = cache(async (): Promise<SiteSeoGlobalDoc | null> => {
  try {
    const payload = await getPayload({ config })
    const doc = await payload.findGlobal({
      slug: 'site-seo',
      depth: 2,
    })
    return doc as SiteSeoGlobalDoc
  } catch {
    return null
  }
})

/** SEO одной статической страницы из массива «SEO по страницам» в глобале site-seo. */
export const getSiteSeoPageOverride = cache(async (pathname: string): Promise<SiteSeoPageOverride | null> => {
  const global = await getSiteSeoGlobal()
  const rows = global?.pageOverrides
  if (!Array.isArray(rows) || rows.length === 0) return null

  const n = normalizeContentPath(pathname)
  const row = rows.find((r) => normalizeContentPath(r.path ?? '/') === n)
  return row ?? null
})
