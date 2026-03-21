'use client'

import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import styles from './TokenomicsCompositionBlock.module.scss'

const ease = 'easeOut' as const

// ── SVG icons ────────────────────────────────────────────────────

function IconEmission() {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden className={styles.svg}>
      <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
      <circle cx="48" cy="48" r="28" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.25" />
      <circle cx="48" cy="48" r="18" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.4" />
      <circle cx="48" cy="48" r="8"  stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      <circle cx="48" cy="48" r="3"  fill="currentColor" fillOpacity="0.9" />
      <line x1="48" y1="10" x2="48" y2="20" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
      <line x1="86" y1="48" x2="76" y2="48" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
      <line x1="48" y1="86" x2="48" y2="76" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
      <line x1="10" y1="48" x2="20" y2="48" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
    </svg>
  )
}

function IconRelease() {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden className={styles.svg}>
      <rect x="8"  y="68" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.9" />
      <rect x="30" y="52" width="16" height="36" rx="2" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.75" />
      <rect x="52" y="36" width="16" height="52" rx="2" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
      <rect x="74" y="20" width="16" height="68" rx="2" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.45" />
      <path d="M 16 60 L 38 44 L 60 28 L 82 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" strokeOpacity="0.5" />
      <circle cx="16" cy="60" r="2.5" fill="currentColor" fillOpacity="0.8" />
      <circle cx="38" cy="44" r="2.5" fill="currentColor" fillOpacity="0.8" />
      <circle cx="60" cy="28" r="2.5" fill="currentColor" fillOpacity="0.8" />
      <circle cx="82" cy="12" r="2.5" fill="currentColor" fillOpacity="0.8" />
    </svg>
  )
}

function IconAllocation() {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden className={styles.svg}>
      <rect x="8" y="20" width="80" height="56" rx="3" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      <rect x="8" y="20" width="28" height="56" rx="3" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
      <rect x="36" y="20" width="22" height="56" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
      <rect x="58" y="20" width="16" height="56" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.35" />
      <rect x="74" y="20" width="14" height="56" rx="0 3 3 0" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.25" />
      <line x1="8" y1="48" x2="88" y2="48" stroke="currentColor" strokeWidth="1" strokeOpacity="0.18" strokeDasharray="3 3" />
    </svg>
  )
}

function IconVesting() {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden className={styles.svg}>
      <line x1="8" y1="48" x2="88" y2="48" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
      <rect x="10" y="38" width="18" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      <path d="M 19 34 L 19 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M 14 30 L 24 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
      <rect x="34" y="38" width="18" height="20" rx="2" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
      <path d="M 43 38 L 43 32 L 37 32 L 37 28 L 49 28 L 49 32 L 43 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
      <rect x="58" y="38" width="18" height="20" rx="2" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
      <rect x="76" y="38" width="12" height="20" rx="2" fill="currentColor" fillOpacity="0.02" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      <path d="M 28 48 L 34 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M 52 48 L 58 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M 70 48 L 76 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3" />
    </svg>
  )
}

function IconClosedLoop() {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden className={styles.svg}>
      <circle cx="48" cy="48" r="32" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
      <circle cx="48" cy="16" r="7" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" />
      <circle cx="76" cy="63" r="7" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" />
      <circle cx="20" cy="63" r="7" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" />
      <path d="M 52 22 Q 70 30 73 56" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.6" markerEnd="url(#arrowLoop)" />
      <path d="M 69 69 Q 55 82 41 70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.6" />
      <path d="M 24 57 Q 22 36 44 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.6" />
      <defs>
        <marker id="arrowLoop" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M 0 0 L 5 2.5 L 0 5 Z" fill="rgba(255,255,255,0.6)" />
        </marker>
      </defs>
    </svg>
  )
}

function IconTreasury() {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden className={styles.svg}>
      <rect x="18" y="44" width="44" height="36" rx="3" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      <path d="M 18 56 L 62 56" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      <rect x="26" y="60" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <rect x="45" y="60" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <path d="M 14 44 L 40 28 L 66 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" />
      <path d="M 72 26 Q 82 34 72 42 Q 62 34 72 26 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" />
      <circle cx="72" cy="34" r="2" fill="currentColor" fillOpacity="0.7" />
    </svg>
  )
}

function IconUtility() {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden className={styles.svg}>
      <circle cx="20" cy="48" r="8" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      <circle cx="48" cy="20" r="8" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      <circle cx="76" cy="48" r="8" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      <circle cx="48" cy="76" r="8" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
      <circle cx="48" cy="48" r="6" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.9" />
      <line x1="28" y1="48" x2="42" y2="48" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="54" y1="48" x2="68" y2="48" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="48" y1="28" x2="48" y2="42" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="48" y1="54" x2="48" y2="68" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="31" y1="38" x2="39" y2="28" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 2" />
      <line x1="57" y1="28" x2="65" y2="38" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 2" />
      <line x1="65" y1="58" x2="57" y2="68" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 2" />
      <line x1="39" y1="68" x2="31" y2="58" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 2" />
    </svg>
  )
}

function IconWhitePaper() {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden className={styles.svg}>
      <rect x="20" y="10" width="56" height="70" rx="3" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
      <path d="M 44 10 L 44 26 L 76 26" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
      <rect x="44" y="10" width="32" height="16" rx="0 3 0 0" fill="currentColor" fillOpacity="0.04" />
      <line x1="30" y1="38" x2="66" y2="38" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
      <line x1="30" y1="46" x2="58" y2="46" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" />
      <rect x="30" y="56" width="36" height="14" rx="2" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="34" y1="61" x2="62" y2="61" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
      <line x1="34" y1="65" x2="54" y2="65" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
      <circle cx="70" cy="72" r="12" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <path d="M 64 72 L 68 76 L 76 68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
    </svg>
  )
}

// ── Data ──────────────────────────────────────────────────────────

const ITEMS = [
  {
    title: 'Оптимальная эмиссия',
    description: 'Определяем, как токен появляется в системе: через майнинг, покупку или алгоритмическое распределение.',
    group: 'ядро',
    Icon: IconEmission,
    large: true,
  },
  {
    title: 'Механика выпуска',
    description: 'Объёмы на продажу, вознаграждения, поощрения и задачи экосистемы.',
    group: 'ядро',
    Icon: IconRelease,
    large: false,
  },
  {
    title: 'Фонд распределения',
    description: 'Делим токены по пулам, задаём сроки заморозки и график раздачи.',
    group: 'структура',
    Icon: IconAllocation,
    large: false,
  },
  {
    title: 'Пулы, заморозки и вестинг',
    description: 'Логика применения токенов, накопления во внутренних фондах и повторного вывода.',
    group: 'структура',
    Icon: IconVesting,
    large: false,
  },
  {
    title: 'Замкнутая экосистема',
    description: 'Механизмы против манипуляций, крупных продаж и сценариев, которые могут быстро обнулить цену.',
    group: 'контур ценности',
    Icon: IconClosedLoop,
    large: true,
  },
  {
    title: 'Treasury, резервы и хеджирование',
    description: 'Кредитные пулы, деривативы, дефляционные механики и NFT-инструменты.',
    group: 'контур ценности',
    Icon: IconTreasury,
    large: false,
  },
  {
    title: 'Финансовые и utility-механики',
    description: 'Связываем токеномику с on-chain/off-chain логикой, ликвидностью и правилами системы.',
    group: 'надстройка',
    Icon: IconUtility,
    large: false,
  },
  {
    title: 'Визуализация для white paper',
    description: 'Диаграммы, графики и таблицы для документации проекта.',
    group: 'надстройка',
    Icon: IconWhitePaper,
    large: false,
  },
]

// ── Component ─────────────────────────────────────────────────────

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
    <section className={styles.section} aria-label="Состав токеномики">
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
          {ITEMS.map((item, i) => {
            const { Icon } = item
            return (
              <motion.article
                key={i}
                className={`${styles.card} ${item.large ? styles.cardLarge : ''} ${i === 4 ? styles.cardLoop : ''}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.055 }}
              >
                {i === 4 ? (
                  <>
                    <div className={styles.cardIconRight} aria-hidden>
                      <Icon />
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardDesc}>{item.description}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.cardIcon}>
                      <Icon />
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardDesc}>{item.description}</p>
                    </div>
                  </>
                )}
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
