import type { ReactNode } from 'react'
import styles from './HeroBadge.module.scss'

interface HeroBadgeProps {
  /** Pink pill on the left; a link when `href` is set. */
  accent: ReactNode
  href?: string
  title?: string
  children: ReactNode
}

/** Hero badge: a pink pill and a short fact in one rounded frame. */
export function HeroBadge({ accent, href, title, children }: HeroBadgeProps) {
  return (
    <p className={styles.badge}>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={styles.accent}>
          <span className={styles.underline}>{accent}</span>
        </a>
      ) : (
        <span className={styles.accent}>{accent}</span>
      )}
      <span className={styles.text}>{children}</span>
    </p>
  )
}
