'use client'

import { useEffect } from 'react'
import { apiPath } from '@/shared/lib/apiPath'

interface Props {
  slug: string
}

export function ArticleViewTracker({ slug }: Props) {
  useEffect(() => {
    const key = `article_view_${slug}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
    fetch(apiPath(`/api/articles/${slug}/view`), { method: 'POST' }).catch(() => {})
  }, [slug])

  return null
}
