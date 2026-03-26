'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import { cases, casesContent, allTags, type CaseTag, type CaseStudy } from '@/shared/content/casesPage'
import { t } from '@/shared/i18n'
import styles from './CasesPage.module.scss'

const ease = 'easeOut' as const

const tagClassMap: Record<CaseTag, string> = {
  DeFi: styles.tagDeFi,
  GameFi: styles.tagGameFi,
  RWA: styles.tagRWA,
  Finance: styles.tagFinance,
}

function CaseCard({ c, index }: { c: CaseStudy; index: number }) {
  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease, delay: (index % 2) * 0.08 }}
      layout
    >
      <span className={`${styles.cardTag} ${tagClassMap[c.tag]}`}>{c.tag}</span>

      <h3 className={styles.cardTitle}>{c.title}</h3>

      <div className={styles.cardTask}>
        <p className={styles.cardTaskLabel}>{t({ ru: 'Задача', en: 'Task' })}</p>
        <p className={styles.cardTaskText}>{c.task}</p>
      </div>

      <div className={styles.cardActions}>
        <p className={styles.cardActionsLabel}>{t({ ru: 'Что сделали', en: 'What we did' })}</p>
        {c.actions.map((a, i) => (
          <div key={i} className={styles.actionItem}>
            <span className={styles.actionArrow} aria-hidden>→</span>
            <span>{a}</span>
          </div>
        ))}
      </div>

      <div className={styles.cardResult}>
        <p className={styles.resultLabel}>{t({ ru: 'Результат', en: 'Result' })}</p>
        <p className={styles.resultText}>{c.result}</p>
      </div>
    </motion.article>
  )
}

export function CasesPage() {
  const [activeTag, setActiveTag] = useState<CaseTag | null>(null)

  const filtered = useMemo(
    () => (activeTag ? cases.filter((c) => c.tag === activeTag) : cases),
    [activeTag],
  )

  return (
    <>
      {/* Hero */}
      <section className={styles.hero} aria-label={t({ ru: 'Портфолио', en: 'Portfolio' })}>
        <div className={styles.heroInner}>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease }}
          >
            {t({ ru: 'Кейсы', en: 'Cases' })}
          </motion.span>

          <motion.h1
            className={styles.heroHeadline}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.05 }}
          >
            {t({ ru: 'Портфолио', en: 'Portfolio' })}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.12 }}
          >
            <ScrollRevealText
              text={casesContent.description}
              className={styles.heroDescription}
            />
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className={styles.filters}>
        <button
          className={activeTag === null ? styles.filterBtnActive : styles.filterBtn}
          onClick={() => setActiveTag(null)}
        >
          {t({ ru: 'Все', en: 'All' })}
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            className={activeTag === tag ? styles.filterBtnActive : styles.filterBtn}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((c, i) => <CaseCard key={c.title} c={c} index={i} />)
          ) : (
            <p className={styles.empty}>{t({ ru: 'Кейсов пока нет', en: 'No cases yet' })}</p>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
