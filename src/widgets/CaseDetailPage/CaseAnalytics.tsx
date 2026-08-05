'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import type { CaseFormat, CaseService } from '@/entities/case-study'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'

export function CaseViewTracker({
  slug,
  format,
  service,
}: {
  slug: string
  format: CaseFormat
  service: CaseService | null
}) {
  useEffect(() => {
    trackPlatformEvent('case_viewed', { slug, format, service: service ?? undefined })
  }, [format, service, slug])

  return null
}

export function CaseActionLink({
  href,
  className,
  slug,
  target,
  children,
}: {
  href: string
  className?: string
  slug: string
  target: 'book_similar_project' | 'related_article'
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackPlatformEvent('case_cta_clicked', {
          slug,
          target,
        })
      }
    >
      {children}
    </Link>
  )
}
