'use client'

import { useId, useState } from 'react'
import clsx from 'clsx'
import { Section, Tabs } from '@/shared/ds'
import { HeroDigits } from '@/widgets/BinaryArt/heroDigits/HeroDigits'
import invest from '../assets/sc-usecase-invest2.webp'
import rwa from '../assets/sc-usecase-rwa.webp'
import defi from '../assets/sc-usecase-defi.webp'
import gamefi from '../assets/sc-usecase-gamefi.webp'
import iconHouse from '../assets/ic-house.svg'
import iconBook from '../assets/ic-book.svg'
import iconMoneybag from '../assets/ic-moneybag.svg'
import iconGridSearch from '../assets/ic-grid-search.svg'
import styles from './UseCases.module.scss'

const IMAGES = [invest, rwa, defi, gamefi]
const ICONS = [iconHouse, iconBook, iconMoneybag, iconGridSearch]

interface UseCasesProps {
  title: string
  tabsLabel: string
  items: readonly { label: string; cards: readonly { title: string; description: string }[] }[]
}

/** Industry tabs: a photo with the hover digit overlay and four problem cards. */
export function UseCases({ title, tabsLabel, items }: UseCasesProps) {
  const panelId = useId()
  const [tab, setTab] = useState('0')
  const active = Number(tab)
  return (
    <Section>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        <Tabs
          items={items.map((item, i) => ({ value: String(i), label: item.label, icon: ICONS[i] }))}
          value={tab}
          onChange={setTab}
          label={tabsLabel}
          panelIdPrefix={panelId}
          className={styles.tabs}
        />
      </div>
      <div id={`${panelId}-${tab}`} role="tabpanel" className={styles.panel}>
        <div className={styles.media}>
          {items.map((item, i) => (
            <HeroDigits
              key={i}
              src={IMAGES[i]}
              alt={i === active ? item.label : ''}
              sizes="(max-width: 1024px) 100vw, 595px"
              className={clsx(styles.photo, i === active && styles.photoActive)}
            />
          ))}
          <div className={styles.grain} aria-hidden="true" />
        </div>
        <ul className={styles.cards}>
          {items[active].cards.map((card) => (
            <li key={card.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardText}>{card.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
