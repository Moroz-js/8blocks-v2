'use client'

import { useEffect, useRef, useState } from 'react'
import { lang } from '@/shared/i18n'
import enData from '@/shared/lib/platform/cases/content.json'
import ruData from '@/shared/lib/platform/cases/content.ru.json'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { platformPagesContent } from '@/shared/content/platformPages'
import styles from './Platform.module.scss'

interface Source {
  title: string
  url: string
}

interface CaseItem {
  name: string
  monogram: string
  class: string
  metric: string
  metricLabel: string
  line: string
  year: string
  honest?: boolean
  logo?: string
  source: Source
}

interface CasesData {
  stats: {
    value: number
    prefix: string
    suffix: string
    label: string
    source: Source
  }[]
  classes: string[]
  cases: CaseItem[]
}

const data = (lang === 'ru' ? ruData : enData) as CasesData

function CountUp({
  value,
  prefix,
  suffix,
}: {
  value: number
  prefix: string
  suffix: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const startedAt = performance.now()
      const tick = (time: number) => {
        const progress = Math.min((time - startedAt) / 900, 1)
        setDisplay(value * (1 - Math.pow(1 - progress, 3)))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <span ref={ref}>
      {prefix}
      {Number.isInteger(value) ? Math.round(display) : display.toFixed(2)}
      {suffix}
    </span>
  )
}

function Logo({ item }: { item: CaseItem }) {
  if (!item.logo || item.honest) {
    return <span className={styles.optionCode}>{item.monogram}</span>
  }
  return (
    // The logo files are curated local brand assets.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={styles.orgLogo}
      src={`/logos/orgs/${item.logo}.svg`}
      alt=""
      aria-hidden="true"
    />
  )
}

export function CasesShowcase() {
  const [active, setActive] = useState(data.classes[0])
  const cases = data.cases.filter(
    (item) => active === data.classes[0] || item.class === active,
  )

  return (
    <>
      <div className={styles.statGrid}>
        {data.stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <div className={styles.statValue}>
              <CountUp
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </div>
            <p className={styles.fine}>{stat.label}</p>
            <a
              href={stat.source.url}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className={styles.source}
            >
              {stat.source.title}
            </a>
          </div>
        ))}
      </div>

      <div className={styles.filters}>
        {data.classes.map((category) => (
          <button
            key={category}
            type="button"
            className={`${styles.filter} ${
              category === active ? styles.filterActive : ''
            }`}
            onClick={() => {
              setActive(category)
              trackPlatformEvent('case_filter_selected', {
                tool: 'cases',
                class: category,
              })
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {active !== data.classes[0] && (
        <div className={styles.notice}>
          <div className={styles.spread}>
            <span>{platformPagesContent.cases.ctaTitle}</span>
            <a
              href="/product/tokenization-readiness"
              className={styles.primary}
              onClick={() =>
                trackPlatformEvent('cta_click', {
                  tool: 'cases',
                  target: 'readiness_from_filter',
                  class: active,
                })
              }
            >
              {platformPagesContent.cases.filterCta} →
            </a>
          </div>
        </div>
      )}

      <div className={styles.cardGrid}>
        {cases.map((item) => (
          <article
            key={`${item.name}-${item.class}`}
            className={`${styles.card} ${styles.caseCard}`}
          >
            <div className={styles.spread}>
              <Logo item={item} />
              <span className={styles.mono}>{item.year}</span>
            </div>
            <div>
              <h3>{item.name}</h3>
              <span className={styles.label}>{item.class}</span>
            </div>
            <div className={`${styles.caseMetric} ${styles.accent}`}>
              {item.metric}
            </div>
            <span className={styles.fine}>{item.metricLabel}</span>
            <p className={styles.description}>{item.line}</p>
            <a
              href={item.source.url}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className={styles.source}
            >
              {item.source.title} ↗
            </a>
          </article>
        ))}
      </div>
    </>
  )
}
