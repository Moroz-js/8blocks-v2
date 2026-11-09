import type { ReactNode } from 'react'
import Image, { type StaticImageData } from 'next/image'
import clsx from 'clsx'
import gradient from '../../assets/cta-gradient.webp'
import { Button } from '../../ui/Button'
import { Pill } from '../../ui/Elements'
import styles from './Cta.module.scss'

interface CtaAction {
  label: string
  href: string
}

interface CtaProps {
  title: ReactNode
  description?: ReactNode
  primary: CtaAction
  secondary?: CtaAction
  /**
   * `left`  — «CTA - левый край» (40:549): text left, buttons right.
   * `price` — «CTA - цена» (40:757): centred, with a facts pill on the top edge.
   */
  variant?: 'left' | 'price'
  /**
   * Title scale for the `left` variant: `lg` — Heading 3 (Figma), `md` — Heading 4
   * with small text, `sm` — Heading 5, a single centred row (service pages),
   * `xs` — Text L title for a card in a narrow column.
   */
  size?: 'lg' | 'md' | 'sm' | 'xs'
  /** Background art instead of the default pink gradient; `null` — plain surface. */
  image?: StaticImageData | null
  /** Facts for the `price` variant: ['$2500', '1-3 hours', 'full team']. */
  facts?: readonly ReactNode[]
  className?: string
}

/** Call-to-action card on the pink «Astro» gradient. */
export function Cta({ title, description, primary, secondary, variant = 'left', size = 'lg', image, facts, className }: CtaProps) {
  return (
    <div className={clsx(styles.wrap, styles[variant], variant === 'left' && styles[size], className)}>
      {variant === 'price' && facts && facts.length > 0 && <Pill items={facts} className={styles.pill} />}
      <div className={styles.card}>
        {/* Gradient art exported from Figma («Astro Gradient (3)», 40:760). */}
        {image !== null && (
          <Image src={image ?? gradient} alt="" fill sizes="(max-width: 1280px) 100vw, 1200px" className={styles.bg} />
        )}
        <div className={styles.text}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.actions}>
          <Button href={primary.href}>{primary.label}</Button>
          {secondary && (
            <Button variant="tertiary" href={secondary.href}>
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
