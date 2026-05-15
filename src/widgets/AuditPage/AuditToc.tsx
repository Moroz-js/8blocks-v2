'use client'

import { uiStrings } from '@/shared/content/uiStrings'
import type { TocItem } from '@/shared/lib/buildToc'
import styles from './AuditToc.module.scss'

interface Props {
  items: TocItem[]
}

export function AuditToc({ items }: Props) {
  if (items.length < 2) return null

  return (
    <nav className={styles.toc} aria-label={uiStrings.tableOfContents}>
      <div className={styles.inner}>
        <p className={styles.title}>{uiStrings.tableOfContents}</p>
        <ol className={styles.list}>
          {items.map(({ id, text, level }, index) => (
            <li key={id} className={styles.item}>
              <a
                href={`#${id}`}
                className={[
                  styles.itemLink,
                  level === 3 ? styles.itemLinkL3 : '',
                  level === 4 ? styles.itemLinkL4 : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className={styles.number}>{index + 1}</span>
                <span className={styles.dots} aria-hidden="true" />
                <span className={styles.linkText}>{text}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
