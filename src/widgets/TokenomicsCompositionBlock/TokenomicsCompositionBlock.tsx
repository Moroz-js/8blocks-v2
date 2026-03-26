'use client'

import { useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { t } from '@/shared/i18n'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import styles from './TokenomicsCompositionBlock.module.scss'

const ease = 'easeOut' as const

const ITEMS = [
  {
    title: t({ ru: 'Оптимальная эмиссия', en: 'Optimal issuance' }),
    description: t({
      ru: 'Определяем, как токен появляется в системе: через майнинг, покупку или алгоритмическое распределение.',
      en: 'Define how tokens enter the system: mining, purchase, or algorithmic distribution.',
    }),
  },
  {
    title: t({ ru: 'Механика выпуска', en: 'Release mechanics' }),
    description: t({
      ru: 'Объёмы на продажу, вознаграждения, поощрения и задачи экосистемы.',
      en: 'Allocate volumes across sales, rewards, incentives, and ecosystem goals.',
    }),
  },
  {
    title: t({ ru: 'Фонд распределения', en: 'Allocation framework' }),
    description: t({
      ru: 'Делим токены по пулам, задаём сроки заморозки и график раздачи.',
      en: 'Split tokens into pools and define lock periods and release schedules.',
    }),
  },
  {
    title: t({ ru: 'Пулы, заморозки и вестинг', en: 'Pools, lockups, and vesting' }),
    description: t({
      ru: 'Логика применения токенов, накопления во внутренних фондах и повторного вывода.',
      en: 'Design token utility, internal treasury accumulation, and recirculation logic.',
    }),
  },
  {
    title: t({ ru: 'Замкнутая экосистема', en: 'Closed-loop ecosystem' }),
    description: t({
      ru: 'Механизмы против манипуляций, крупных продаж и сценариев, которые могут быстро обнулить цену.',
      en: 'Build safeguards against manipulation, large dumps, and scenarios that can rapidly collapse price.',
    }),
  },
  {
    title: t({ ru: 'Treasury, резервы и хеджирование', en: 'Treasury, reserves, and hedging' }),
    description: t({
      ru: 'Кредитные пулы, деривативы, дефляционные механики и NFT-инструменты.',
      en: 'Cover lending pools, derivatives, deflationary mechanisms, and NFT utilities.',
    }),
  },
  {
    title: t({ ru: 'Финансовые и utility-механики', en: 'Financial and utility mechanics' }),
    description: t({
      ru: 'Связываем токеномику с on-chain/off-chain логикой, ликвидностью и правилами системы.',
      en: 'Align tokenomics with on-chain/off-chain logic, liquidity, and system rules.',
    }),
  },
  {
    title: t({ ru: 'Визуализация для white paper', en: 'White paper visualization' }),
    description: t({
      ru: 'Диаграммы, графики и таблицы для документации проекта.',
      en: 'Prepare diagrams, charts, and tables for project documentation.',
    }),
  },
]

type Dir = 'top' | 'right' | 'bottom' | 'left'

function getDirection(el: HTMLElement, e: React.MouseEvent): Dir {
  const { left, top, width, height } = el.getBoundingClientRect()
  const x = (e.clientX - left - width / 2) / width
  const y = (e.clientY - top - height / 2) / height
  if (Math.abs(x) > Math.abs(y)) return x > 0 ? 'right' : 'left'
  return y > 0 ? 'bottom' : 'top'
}

const TRANSLATE: Record<Dir, string> = {
  top: 'translateY(-100%)',
  bottom: 'translateY(100%)',
  left: 'translateX(-100%)',
  right: 'translateX(100%)',
}

function DirectionCard({ title, desc, i }: { title: string; desc: string; i: number }) {
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const dir = getDirection(el, e)
    const overlay = overlayRef.current
    if (!overlay) return
    overlay.style.transition = 'none'
    overlay.style.transform = TRANSLATE[dir]
    void overlay.offsetHeight
    overlay.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1)'
    overlay.style.transform = 'translate(0,0)'
  }, [])

  const handleLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const dir = getDirection(el, e)
    const overlay = overlayRef.current
    if (!overlay) return
    overlay.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1)'
    overlay.style.transform = TRANSLATE[dir]
  }, [])

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, ease, delay: i * 0.055 }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div ref={overlayRef} className={styles.cardOverlay} />
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{desc}</p>
    </motion.article>
  )
}

interface TokenomicsCompositionBlockProps {
  label?: string
  headline: string
  description?: string
}

export function TokenomicsCompositionBlock({
  label,
  headline,
  description,
}: TokenomicsCompositionBlockProps) {
  return (
    <section className={styles.section} aria-label={t({ ru: 'Состав токеномики', en: 'Tokenomics structure' })}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease }}
        >
          {label && (
            <span className={styles.label}>
              <span className={styles.bracket}>[</span>
              {label}
              <span className={styles.bracket}>]</span>
            </span>
          )}
          <ScrollRevealText text={headline} className={styles.headline} />
          {description && <ScrollRevealText text={description} className={styles.description} />}
        </motion.div>

        <div className={styles.grid}>
          {ITEMS.map((item, i) => (
            <DirectionCard key={i} title={item.title} desc={item.description} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
