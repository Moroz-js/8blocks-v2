'use client'

import { useEffect } from 'react'
import { apiPath } from '@/shared/lib/apiPath'

interface Props {
  slug: string
}

/** Staging shares the production database: its visits must not count as views. */
const isStaging = process.env.NEXT_PUBLIC_STAGING === 'true'

export function ArticleViewTracker({ slug }: Props) {
  useEffect(() => {
    if (isStaging) return
    const key = `article_view_${slug}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
    fetch(apiPath(`/api/articles/${slug}/view`), { method: 'POST' }).catch(() => {})
  }, [slug])

  return null
}
