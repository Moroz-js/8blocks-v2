'use client'

import { useState } from 'react'
import Image, { type StaticImageData } from 'next/image'
import clsx from 'clsx'
import { Button } from '@/shared/ds'
import { useScramble } from '@/shared/lib/useScramble'
import { BinaryGlyph } from '@/widgets/BinaryArt/BinaryGlyph'
import bg1 from '../assets/fix-bg-1.webp'
import bg2 from '../assets/fix-bg-2.webp'
import bg3 from '../assets/fix-bg-3.webp'
import bg4 from '../assets/fix-bg-4.webp'
import bg5 from '../assets/fix-bg-5.webp'
import bg6 from '../assets/fix-bg-6.webp'
import styles from './FixCards.module.scss'

const OPEN_ART: { shape: string; bg: StaticImageData }[] = [
  { shape: 'padlock', bg: bg1 },
  { shape: 'team', bg: bg2 },
  { shape: 'scales', bg: bg3 },
]
const LOCKED_ART: { shape: string; bg: StaticImageData }[] = [
  { shape: 'buoy', bg: bg4 },
  { shape: 'hourglass', bg: bg5 },
  { shape: 'stairs', bg: bg6 },
]
const EyeIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 3.75c4.17 0 7.72 2.59 9.17 6.25-1.45 3.66-5 6.25-9.17 6.25S2.28 13.66.83 10C2.28 6.34 5.83 3.75 10 3.75Zm0 2.08a4.17 4.17 0 1 0 0 8.34 4.17 4.17 0 0 0 0-8.34Zm0 1.67a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
  </svg>
)
const EyeOffIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M2.5 1.32 18.68 17.5l-1.18 1.18-3.16-3.16c-2.21 1.23-4.69 1.48-7.02.72-2.53-.82-4.82-2.81-6.39-5.86L.73 10l.2-.38c.9-1.75 2.04-3.15 3.33-4.18L1.32 2.5 2.5 1.32ZM6.67 10c0-.62.17-1.2.46-1.69l1.26 1.26A1.67 1.67 0 0 0 10.43 11.6l1.26 1.27A3.33 3.33 0 0 1 6.67 10Z"
    />
    <path d="M19.07 10.38a12.4 12.4 0 0 1-2.1 3.05L7.3 3.77A9.07 9.07 0 0 1 10 3.33c3.53 0 6.95 2.18 9.07 6.29l.2.38-.2.38Z" />
  </svg>
)
const LockIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5.83 8.33v-2.5a4.17 4.17 0 0 1 8.34 0v2.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    <path d="M13.75 8.33h-7.5a2.5 2.5 0 0 0-2.5 2.5v3.75a2.5 2.5 0 0 0 2.5 2.5h7.5a2.5 2.5 0 0 0 2.5-2.5v-3.75a2.5 2.5 0 0 0-2.5-2.5Z" fill="currentColor" />
  </svg>
)

export interface FixCardsCopy {
  improvement: string
  leaveWith: string
  see: string
  hide: string
  locked: string
  lockedHref: string
}

function OpenCard({ index, title, result, copy }: { index: number; title: string; result: string; copy: FixCardsCopy }) {
  const [open, setOpen] = useState(false)
  const label = open ? copy.leaveWith : copy.improvement.replace('{n}', String(index + 1))
  const text = useScramble(open ? result : title)
  const art = OPEN_ART[index % OPEN_ART.length]
  return (
    <li className={clsx(styles.card, open && styles.open)}>
      <Image src={art.bg} alt="" fill sizes="(max-width: 640px) 100vw, 400px" className={styles.bg} />
      <div className={styles.glyph} aria-hidden="true">
        <BinaryGlyph shape={art.shape} os={0.93} />
      </div>
      <div className={styles.text}>
        <p className={styles.label}>{label}</p>
        <p className={styles.title} aria-live="polite">
          {text}
        </p>
      </div>
      <Button
        variant="tertiary"
        className={styles.action}
        icon={open ? EyeOffIcon : EyeIcon}
        iconPosition="left"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? copy.hide : copy.see}
      </Button>
    </li>
  )
}

/** Growth points: open fixes flip to their outcome, the rest wait for the call. */
export function FixCards({
  open,
  locked,
  copy,
}: {
  open: { title: string; result: string }[]
  locked: string[]
  copy: FixCardsCopy
}) {
  return (
    <div className={styles.rows}>
      {open.length > 0 && (
        <ul className={styles.grid}>
          {open.map((fix, i) => (
            <OpenCard key={fix.title} index={i} title={fix.title} result={fix.result} copy={copy} />
          ))}
        </ul>
      )}
      <ul className={clsx(styles.grid, styles.lockedRow)}>
        {locked.map((title, i) => (
          <li key={title} className={styles.card}>
            <Image src={LOCKED_ART[i % LOCKED_ART.length].bg} alt="" fill sizes="(max-width: 640px) 100vw, 400px" className={styles.bg} />
            <div className={styles.glyph} aria-hidden="true">
              <BinaryGlyph shape={LOCKED_ART[i % LOCKED_ART.length].shape} os={0.93} />
            </div>
            <div className={styles.text}>
              <p className={styles.label}>{copy.improvement.replace('{n}', String(open.length + i + 1))}</p>
              <p className={styles.title}>{title}</p>
            </div>
            <Button variant="tertiary" href={copy.lockedHref} className={styles.action} icon={LockIcon} iconPosition="left">
              {copy.locked}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
