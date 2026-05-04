export type SiteSeoPageOverride = {
  path?: string | null
  title?: string | null
  seoTitle?: string | null
  metaDescription?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: unknown
  twitterTitle?: string | null
  twitterDescription?: string | null
  canonicalUrl?: string | null
  robotsNoindex?: boolean | null
  pageHeadMarkup?: string | null
}

export type SiteSeoGlobalDoc = {
  globalHeadMarkup?: string | null
  pageOverrides?: SiteSeoPageOverride[] | null
}
