import type { CSSProperties } from 'react'
import Image, { type StaticImageData } from 'next/image'
import clsx from 'clsx'
import { Button, Section } from '@/shared/ds'
import styles from './CoverCard.module.scss'

interface CoverCardProps {
  title: string
  description: string
  action: { label: string; href: string }
  image: StaticImageData
  imageAlt: string
  /**
   * Art box on desktop, px: may rise above the card's top; `bottom` below 0 sinks it
   * under the card's bottom edge (clipped there).
   */
  art: { width: number; height: number; right: number; bottom?: number }
  /** `stack` — button under the text; `row` — text left, button bottom right. */
  layout?: 'stack' | 'row'
}

/** Card with text and a button and an illustration rising out of it on the right. */
export function CoverCard({ title, description, action, image, imageAlt, art, layout = 'stack' }: CoverCardProps) {
  const vars = {
    '--art-width': `${art.width}px`,
    '--art-height': `${art.height}px`,
    '--art-right': `${art.right}px`,
    '--art-bottom': `${art.bottom ?? 0}px`,
    '--art-ratio': `${art.width} / ${art.height}`,
  } as CSSProperties
  return (
    <Section>
      <div className={clsx(styles.card, styles[layout])} style={vars}>
        <div className={styles.text}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
        <Button href={action.href} className={styles.action}>
          {action.label}
        </Button>
        <div className={styles.clip}>
          <div className={styles.art}>
            <Image src={image} alt={imageAlt} fill sizes={`${art.width}px`} />
          </div>
        </div>
      </div>
    </Section>
  )
}
