'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import styles from './UseCasesTabs.module.scss'

const ease = 'easeOut' as const

export interface UseCasesTabBullet {
  title: string
  description: string
}

export interface UseCasesTabItem {
  label: string
  title: string
  intro?: string
  bullets?: readonly UseCasesTabBullet[]
}

interface UseCasesTabsProps {
  headline: string
  items: readonly UseCasesTabItem[]
}

export function UseCasesTabs({ headline, items }: UseCasesTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const current = items[activeIndex]

  return (
    <section className={styles.section} aria-label="Use cases">
      <div className={styles.inner}>
        <ScrollRevealText text={headline} className={styles.headline} />

        <div className={styles.body}>
          {/* Left: vertical tab list */}
          <div className={styles.tabList} role="tablist">
            {items.map((item, i) => (
              <button
                key={item.label}
                role="tab"
                aria-selected={i === activeIndex}
                className={`${styles.tab} ${i === activeIndex ? styles.tabActive : ''}`}
                onClick={() => setActiveIndex(i)}
              >
                {item.title}
              </button>
            ))}
          </div>

          {/* Right: content for active tab */}
          <div className={styles.contentArea}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className={styles.content}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease }}
              >
                {current.intro && (
                  <p className={styles.intro}>{current.intro}</p>
                )}
                {current.bullets && current.bullets.length > 0 && (
                  <ul className={styles.bulletList}>
                    {current.bullets.map((bullet, j) => (
                      <li key={j} className={styles.bulletItem}>
                        <p className={styles.bulletTitle}>{bullet.title}</p>
                        <p className={styles.bulletDescription}>{bullet.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
