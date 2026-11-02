import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import arrowTopRight from '../../icons/arrow-top-right.svg'
import arrowTopRightLight from '../../icons/arrow-top-right-light.svg'
import chevronLeft from '../../icons/chevron-mini-left.svg'
import chevronRight from '../../icons/chevron-mini-right.svg'
import zap from '../../icons/zap.svg'
import styles from './Elements.module.scss'

/* Small building blocks used across the Figma blocks. */

// ── IconButton ─────────────────────────────────────────────────────────
// Round 48px Charcoal button with a 32px chevron (carousel arrows).
interface IconButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  direction: 'prev' | 'next'
  /** Accessible label, e.g. «Previous». */
  label: string
}

export function IconButton({ direction, label, className, type = 'button', ...props }: IconButtonProps) {
  return (
    <button type={type} aria-label={label} className={clsx(styles.iconButton, className)} {...props}>
      <Image src={direction === 'prev' ? chevronLeft : chevronRight} alt="" width={32} height={32} />
    </button>
  )
}

// ── ArrowLink ──────────────────────────────────────────────────────────
// Source / reference link with a trailing ↗ (cards, FAQ footer).
interface ArrowLinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
  href: string
  /** `muted` — gray on dark cards; `light` — 50% white on gradients. */
  tone?: 'muted' | 'light'
}

export function ArrowLink({ href, tone = 'muted', className, children, ...props }: ArrowLinkProps) {
  const external = /^https?:\/\//.test(href)
  const content = (
    <>
      <span>{children}</span>
      <Image
        src={tone === 'light' ? arrowTopRightLight : arrowTopRight}
        alt=""
        width={20}
        height={20}
        className={styles.arrow}
      />
    </>
  )
  const classes = clsx(styles.arrowLink, styles[tone], className)
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
      {content}
    </a>
  ) : (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  )
}

// ── Pill ───────────────────────────────────────────────────────────────
// Price / facts badge: «$2500 · 1-3 hours · full team».
export function Pill({ items, className }: { items: readonly ReactNode[]; className?: string }) {
  return (
    <p className={clsx(styles.pill, className)}>
      {items.map((item, i) => (
        <span key={i} className={styles.pillItem}>
          {i > 0 && <span className={styles.dot} aria-hidden="true" />}
          {item}
        </span>
      ))}
    </p>
  )
}

// ── Eyebrow ────────────────────────────────────────────────────────────
// Category line above a title: «RWA · COMMODITIES».
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={clsx(styles.eyebrow, className)}>{children}</p>
}

// ── Meta ───────────────────────────────────────────────────────────────
// Icon + short fact, e.g. «⚡ Читать 12 минут».
export function Meta({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={clsx(styles.meta, className)}>
      <Image src={zap} alt="" width={16} height={16} />
      <span>{children}</span>
    </p>
  )
}

// ── StepNumber ─────────────────────────────────────────────────────────
// Roadmap step marker: pink number in a 32px outlined square.
export function StepNumber({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={clsx(styles.step, className)} aria-hidden="true">
      {children}
    </span>
  )
}

// ── Divider ────────────────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return <hr className={clsx(styles.divider, className)} />
}
