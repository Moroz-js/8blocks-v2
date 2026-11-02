import type { ReactNode } from 'react'
import Image, { type ImageProps } from 'next/image'
import clsx from 'clsx'
import accentArt from '../../assets/accent-card.webp'
import asterisk from '../../icons/asterisk.svg'
import { ArrowLink } from '../../ui/Elements'
import styles from './Cards.module.scss'

interface Source {
  label: ReactNode
  href: string
}

/** Figma: «Карточка - акцент» (54:2646) — pink gradient card with a fact and a source. */
export function AccentCard({
  title,
  text,
  source,
  className,
}: {
  title: ReactNode
  text: ReactNode
  source?: Source
  className?: string
}) {
  return (
    <article className={clsx(styles.card, styles.accent, className)}>
      <Image src={accentArt} alt="" fill sizes="394px" className={styles.bg} />
      <Image src={asterisk} alt="" width={24} height={24} />
      <div className={styles.text}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.body}>{text}</p>
      </div>
      {source && (
        <ArrowLink href={source.href} tone="light" className={styles.source}>
          {source.label}
        </ArrowLink>
      )}
    </article>
  )
}

/** Figma: «Карточка - цитата» (54:3074) — research quote with a publisher logo. */
export function QuoteCard({
  logo,
  title,
  text,
  source,
  className,
}: {
  logo?: { src: ImageProps['src']; alt: string; width: number; height: number }
  title: ReactNode
  text: ReactNode
  source?: Source
  className?: string
}) {
  return (
    <article className={clsx(styles.card, styles.quote, className)}>
      {logo && <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className={styles.logo} />}
      <div className={styles.text}>
        <h3 className={styles.title}>{title}</h3>
        <p className={clsx(styles.body, styles.bodyMuted)}>{text}</p>
      </div>
      {source && (
        <ArrowLink href={source.href} className={styles.source}>
          {source.label}
        </ArrowLink>
      )}
    </article>
  )
}
