'use client'

import styles from './HeroLetters.module.scss'

interface HeroLettersProps {
  className?: string
}

export function HeroLetters({ className }: HeroLettersProps) {
  return (
    <div className={`${styles.stage} ${className ?? ''}`} aria-hidden="true">
      <div className={styles.grid} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.icon}
        src="/icons/hero-icon.svg"
        alt=""
        width={348}
        height={460}
        draggable={false}
      />
    </div>
  )
}
