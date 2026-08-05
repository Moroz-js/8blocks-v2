'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import type { CaseCardData, CaseCategory } from '@/entities/case-study'
import { casesContent, casesUiContent } from '@/shared/content/casesPage'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import styles from './CasesPage.module.scss'

const ease = 'easeOut' as const

const tagClassMap: Record<string, string> = {
  DeFi: styles.tagDeFi,
  GameFi: styles.tagGameFi,
  RWA: styles.tagRWA,
  Finance: styles.tagFinance,
}

const categories: CaseCategory[] = ['DeFi', 'GameFi', 'RWA', 'Finance']

function CaseCard({ item, index }: { item: CaseCardData; index: number }) {
  const tag = item.category || item.industry
  const isFull = item.format === 'full'
  const content = (
    <>
      {item.cover && (
        <div className={styles.cardCover}>
          <Image
            src={item.cover.url}
            alt={item.cover.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.cardCoverImage}
          />
        </div>
      )}

      <div className={styles.cardHeader}>
        {tag && (
          <span className={`${styles.cardTag} ${tagClassMap[tag] ?? styles.tagDefault}`}>
            {tag}
          </span>
        )}
        {item.service && (
          <span className={styles.serviceTag}>
            {casesUiContent.serviceLabels[item.service]}
          </span>
        )}
      </div>

      <h3 className={styles.cardTitle}>{item.title}</h3>

      <div className={styles.cardTask}>
        <p className={styles.cardTaskLabel}>{casesUiContent.taskLabel}</p>
        <p className={styles.cardTaskText}>{item.task}</p>
      </div>

      {item.actions.length > 0 && (
        <div className={styles.cardActions}>
          <p className={styles.cardActionsLabel}>{casesUiContent.actionsLabel}</p>
          {item.actions.map((action, actionIndex) => (
            <div key={`${item.slug}-${actionIndex}`} className={styles.actionItem}>
              <span className={styles.actionArrow} aria-hidden>→</span>
              <span>{action}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.cardResult}>
        <p className={styles.resultLabel}>{casesUiContent.resultLabel}</p>
        {item.metricValue && (
          <p className={styles.resultMetric}>
            {item.metricValue}
            {item.metricLabel && <span>{item.metricLabel}</span>}
          </p>
        )}
        <p className={styles.resultText}>{item.result}</p>
      </div>

      {isFull && (
        <span className={styles.cardCta}>
          {casesUiContent.viewFull} <span aria-hidden>→</span>
        </span>
      )}
    </>
  )

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease, delay: (index % 2) * 0.08 }}
      layout
    >
      {isFull ? (
        <Link
          href={`/cases/${item.slug}`}
          className={styles.cardLink}
          onClick={() =>
            trackPlatformEvent('case_opened', {
              slug: item.slug,
              format: item.format,
              category: item.category ?? undefined,
            })
          }
        >
          {content}
        </Link>
      ) : (
        <div className={styles.cardStatic}>{content}</div>
      )}
    </motion.article>
  )
}

interface Props {
  cases: CaseCardData[]
}

export function CasesPage({ cases }: Props) {
  const [activeCategory, setActiveCategory] = useState<CaseCategory | null>(null)

  const filtered = useMemo(
    () =>
      activeCategory
        ? cases.filter((item) => item.category === activeCategory)
        : cases,
    [activeCategory, cases],
  )

  return (
    <>
      {/* Hero */}
      <section className={styles.hero} aria-label={casesUiContent.heroAriaLabel}>
        <div className={styles.heroInner}>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease }}
          >
            {casesUiContent.heroLabel}
          </motion.span>

          <motion.h1
            className={styles.heroHeadline}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.05 }}
          >
            {casesUiContent.heroHeadline}
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
          className={activeCategory === null ? styles.filterBtnActive : styles.filterBtn}
          onClick={() => {
            setActiveCategory(null)
            trackPlatformEvent('case_filter_selected', { category: 'all' })
          }}
        >
          {casesUiContent.filterAll}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={activeCategory === category ? styles.filterBtnActive : styles.filterBtn}
            onClick={() => {
              setActiveCategory(category)
              trackPlatformEvent('case_filter_selected', { category })
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((item, index) => (
              <CaseCard key={item.id} item={item} index={index} />
            ))
          ) : (
            <p className={styles.empty}>{casesUiContent.emptyLabel}</p>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
