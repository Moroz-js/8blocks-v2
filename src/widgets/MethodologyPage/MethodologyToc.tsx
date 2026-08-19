'use client'

import { useEffect, useState } from 'react'
import styles from './MethodologyPage.module.scss'

interface MethodologyTocProps {
  label: string
  items: readonly (readonly [string, string])[]
}

export function MethodologyToc({ label, items }: MethodologyTocProps) {
  const [activeId, setActiveId] = useState(items[0]?.[1] ?? '')

  useEffect(() => {
    const sections = items
      .map(([, id]) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]?.target.id) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [items])

  return (
    <aside className={styles.toc}>
      <p>{label}</p>
      <nav aria-label={label}>
        {items.map(([itemLabel, id]) => (
          <a
            key={id}
            href={`#${id}`}
            className={activeId === id ? styles.tocActive : undefined}
            aria-current={activeId === id ? 'location' : undefined}
          >
            {itemLabel}
          </a>
        ))}
      </nav>
    </aside>
  )
}
