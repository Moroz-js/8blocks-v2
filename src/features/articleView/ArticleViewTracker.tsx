'use client'

import { useEffect } from 'react'

interface Props {
  slug: string
}

export function ArticleViewTracker({ slug }: Props) {
  useEffect(() => {
    const key = `article_view_${slug}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
    fetch(`/api/articles/${slug}/view`, { method: 'POST' }).catch(() => {})
  }, [slug])

  return null
}
