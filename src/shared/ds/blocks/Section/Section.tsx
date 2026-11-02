import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Section.module.scss'

interface SectionProps extends Omit<ComponentPropsWithoutRef<'section'>, 'title'> {
  /** Block title (Figma: Heading 3). Omit for blocks without a heading. */
  title?: ReactNode
  /** Title alignment. */
  align?: 'left' | 'center'
  /** Soft white sheen on the title (carousels, tables). */
  sheen?: boolean
  /** Right-hand slot next to a left-aligned title, e.g. carousel arrows. */
  actions?: ReactNode
  /** Let content run past the right edge of the 1200 column (carousels). */
  bleed?: boolean
  /** Narrow centred column (FAQ, form): 720px. */
  narrow?: boolean
}

/**
 * Page block: 1200 column, 180 rhythm between blocks, 40 between title and
 * content. Every v2 block is wrapped in a Section.
 */
export function Section({
  title,
  align = 'left',
  sheen = false,
  actions,
  bleed = false,
  narrow = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={clsx(styles.section, bleed && styles.bleed, className)} {...props}>
      {(title || actions) && (
        <div className={clsx(styles.header, styles[align])}>
          {title && <h2 className={clsx(styles.title, sheen && styles.sheen)}>{title}</h2>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      <div className={clsx(styles.body, narrow && styles.narrow)}>{children}</div>
    </section>
  )
}
