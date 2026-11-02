import type { ReactNode } from 'react'
import Image, { type ImageProps } from 'next/image'
import clsx from 'clsx'
import { Button } from '../../ui/Button'
import { Eyebrow, Meta } from '../../ui/Elements'
import styles from './CaseList.module.scss'

export interface CaseListItem {
  href: string
  image: { src: ImageProps['src']; alt: string }
  category: ReactNode
  title: ReactNode
  description: ReactNode
  /** e.g. «Читать 12 минут». */
  meta?: ReactNode
  /** Button label, e.g. «View case». */
  cta: string
}

/** Figma: «From our casework» (43:1602) — rows with a thumbnail, divided by lines. */
export function CaseList({ items, className }: { items: readonly CaseListItem[]; className?: string }) {
  return (
    <ul className={clsx(styles.list, className)}>
      {items.map((item) => (
        <li key={item.href} className={styles.item}>
          <div className={styles.thumb}>
            <Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 640px) 100vw, 230px" />
          </div>
          <div className={styles.body}>
            <Eyebrow>{item.category}</Eyebrow>
            <div className={styles.row}>
              <h3 className={styles.title}>{item.title}</h3>
              <Button variant="secondary" href={item.href} className={styles.cta}>
                {item.cta}
              </Button>
            </div>
            <div className={styles.row}>
              <p className={styles.description}>{item.description}</p>
              {item.meta && <Meta>{item.meta}</Meta>}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
