import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import styles from './PostCard.module.scss'

export interface PostCardProps {
  href: string
  title: ReactNode
  /** Category · date line above the title. */
  meta?: ReactNode
  excerpt?: ReactNode
  /** Cover art (16:9-ish, designer's 828 × 466). Without it the card is a text card on the surface. */
  cover?: { url: string; alt?: string } | null
  /** Left side of the bottom row: read time, grade, views. */
  footer?: ReactNode
  action: string
  external?: boolean
  priority?: boolean
  className?: string
}

/** Listing card for blog posts, research, audits and press (project 2 listings). */
export function PostCard({ href, title, meta, excerpt, cover, footer, action, external, priority, className }: PostCardProps) {
  const body = (
    <>
      {cover !== undefined && (
        <span className={styles.cover}>
          {cover && (
            <Image
              src={cover.url}
              alt={cover.alt ?? ''}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              priority={priority}
              className={styles.image}
            />
          )}
        </span>
      )}
      <span className={styles.body}>
        {meta && <span className={styles.meta}>{meta}</span>}
        <span className={styles.title}>{title}</span>
        {excerpt && <span className={styles.excerpt}>{excerpt}</span>}
        <span className={styles.bottom}>
          <span className={styles.footer}>{footer}</span>
          <span className={styles.read}>{action}</span>
        </span>
      </span>
    </>
  )
  const className_ = clsx(styles.card, cover === undefined && styles.text, className)
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className_}>
      {body}
    </a>
  ) : (
    <Link href={href} className={className_}>
      {body}
    </Link>
  )
}

/** Grid of PostCards: 3 columns, 2 on tablet, 1 on mobile. */
export function PostGrid({ children, columns = 3, className }: { children: ReactNode; columns?: 2 | 3; className?: string }) {
  return <div className={clsx(styles.grid, columns === 2 && styles.grid2, className)}>{children}</div>
}
