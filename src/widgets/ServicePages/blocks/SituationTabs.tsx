'use client'

import { useState } from 'react'
import clsx from 'clsx'
import type { StaticImageData } from 'next/image'
import { Tabs } from '@/shared/ds'
import { useScramble } from '@/shared/lib/useScramble'
import { HeroDigits } from '@/widgets/BinaryArt/heroDigits/HeroDigits'
import styles from './SituationTabs.module.scss'

const GLITCH_MS = 520

export interface SituationItem {
  id: string
  tab: string
  icon: StaticImageData
  image: StaticImageData
  imageAlt: string
  headline: string
  holders: string
  keep: string
  check: string
  example: { title: string; body: string }
}

interface SituationTabsProps {
  /** Accessible name of the tab list. */
  label: string
  labels: { headline: string; holders: string; keep: string; check: string }
  items: readonly SituationItem[]
  tabsVariant?: 'pill' | 'ghost'
}

function Card({ label, text }: { label: string; text: string }) {
  const shown = useScramble(text, GLITCH_MS)
  return (
    <div className={styles.card}>
      <p className={styles.cardLabel}>{label}</p>
      <p className={styles.cardText} aria-label={text}>
        <span aria-hidden="true">{shown}</span>
      </p>
    </div>
  )
}

/** Asset situations: tabs, a photo under binary digits and four glitching cards. */
export function SituationTabs({ label, labels, items, tabsVariant }: SituationTabsProps) {
  const [active, setActive] = useState(items[0].id)
  const item = items.find((entry) => entry.id === active) ?? items[0]
  const tabs = items.map((entry) => ({ value: entry.id, label: entry.tab, icon: entry.icon }))

  return (
    <div className={styles.wrap}>
      <Tabs items={tabs} value={active} onChange={setActive} label={label} className={styles.tabs} panelIdPrefix="situation" variant={tabsVariant} />
      <div id={`situation-${active}`} role="tabpanel" className={styles.grid}>
        <div className={styles.media}>
          {items.map((entry) => (
            <div key={entry.id} className={clsx(styles.layer, entry.id === active && styles.active)} aria-hidden={entry.id !== active}>
              <HeroDigits src={entry.image} alt={entry.imageAlt} sizes="(max-width: 1024px) 100vw, 595px" />
            </div>
          ))}
        </div>
        <div className={styles.cards}>
          <Card label={labels.headline} text={item.headline} />
          <Card label={labels.holders} text={item.holders} />
          <Card label={labels.keep} text={item.keep} />
          <Card label={labels.check} text={item.check} />
        </div>
      </div>
      <div className={styles.example}>
        <p className={styles.exampleTitle}>{item.example.title}</p>
        <p className={styles.exampleBody}>{item.example.body}</p>
      </div>
    </div>
  )
}
