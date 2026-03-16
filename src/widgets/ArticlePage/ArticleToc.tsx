'use client'

import { useEffect, useRef, useState } from 'react'
import type { TocItem } from '@/shared/lib/buildToc'
import styles from './ArticleToc.module.scss'

interface Props {
  items: TocItem[]
}

export function ArticleToc({ items }: Props) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!items.length) return

    const headingEls = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    )

    headingEls.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [items])

  if (!items.length) return null

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <p className={styles.tocTitle}>Contents</p>
      <ol className={styles.tocList}>
        {items.map(({ id, text, level }) => (
          <li key={id} className={`${styles.tocItem} ${level === 3 ? styles.tocItemL3 : ''}`}>
            <a
              href={`#${id}`}
              className={`${styles.tocLink} ${activeId === id ? styles.tocLinkActive : ''}`}
            >
              {text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
