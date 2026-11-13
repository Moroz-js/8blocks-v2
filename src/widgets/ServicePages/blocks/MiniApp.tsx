'use client'

import { useId, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { AccentSurface, Button, Section, Tabs } from '@/shared/ds'
import shot1 from '../assets/app-1.webp'
import shot2 from '../assets/app-2.webp'
import shot3 from '../assets/app-3.webp'
import shot4 from '../assets/app-4.webp'
import iconHouse from '../assets/ic-house.svg'
import iconBook from '../assets/ic-book.svg'
import iconMoneybag from '../assets/ic-moneybag.svg'
import iconGridSearch from '../assets/ic-grid-search.svg'
import styles from './MiniApp.module.scss'

const SHOTS = [shot1, shot2, shot3, shot4]
const ICONS = [iconHouse, iconBook, iconMoneybag, iconGridSearch]

export interface MiniAppCopy {
  title: string
  description: string
  tabsLabel: string
  shotAlt: string
  tabs: readonly { label: string; text: string }[]
  baseApp: { label: string; href: string }
  telegram: { label: string; href: string }
}

/** TokenLab mini app promo: tabs switch the phone screenshot. */
export function MiniApp({ copy }: { copy: MiniAppCopy }) {
  const panelId = useId()
  const [tab, setTab] = useState('0')
  const items = copy.tabs.map((item, i) => ({ value: String(i), label: item.label, icon: ICONS[i] }))
  const active = Number(tab)
  return (
    <Section>
      <div className={styles.card}>
        <AccentSurface />
        {SHOTS.map((shot, i) => (
          <Image
            key={i}
            src={shot}
            alt={i === active ? `${copy.shotAlt}: ${copy.tabs[i].label}` : ''}
            sizes="476px"
            className={clsx(styles.shot, i === active && styles.shotActive)}
          />
        ))}
        <div className={styles.text}>
          <h2 className={styles.title}>{copy.title}</h2>
          <p className={styles.description}>{copy.description}</p>
        </div>
        <div className={styles.controls}>
          <Tabs items={items} value={tab} onChange={setTab} label={copy.tabsLabel} panelIdPrefix={panelId} />
          <div className={styles.tabTexts}>
            {copy.tabs.map((item, i) =>
              i === active ? (
                <p key={i} id={`${panelId}-${tab}`} role="tabpanel" className={styles.tabText}>
                  {item.text}
                </p>
              ) : (
                <p key={i} className={clsx(styles.tabText, styles.tabTextHidden)} aria-hidden="true">
                  {item.text}
                </p>
              ),
            )}
          </div>
        </div>
      </div>
      <div className={styles.links}>
        <Button href={copy.baseApp.href} target="_blank" rel="noopener noreferrer">
          {copy.baseApp.label}
        </Button>
        <Button variant="secondary" href={copy.telegram.href} target="_blank" rel="noopener noreferrer">
          {copy.telegram.label}
        </Button>
      </div>
    </Section>
  )
}
