'use client'

import { motion } from 'framer-motion'
import { t } from '@/shared/i18n'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import styles from './AuditZonesBlock.module.scss'

const ease = 'easeOut' as const

// ── SVG schemas ──────────────────────────────────────────────────

function IconTokenMap() {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden className={styles.svg}>
      <rect x="8"  y="8"  width="28" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.8" />
      <rect x="8"  y="36" width="20" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.55" />
      <rect x="8"  y="57" width="20" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
      <rect x="44" y="8"  width="28" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
      <rect x="44" y="28" width="28" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
      <rect x="44" y="48" width="28" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" />
      <line x1="36" y1="18" x2="44" y2="15" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 2" />
      <line x1="36" y1="18" x2="44" y2="35" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 2" />
      <line x1="28" y1="43" x2="44" y2="55" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 2" />
      <circle cx="36" cy="18" r="2" fill="currentColor" fillOpacity="0.7" />
      <circle cx="28" cy="43" r="1.5" fill="currentColor" fillOpacity="0.5" />
    </svg>
  )
}

function IconScenarios() {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden className={styles.svg}>
      <circle cx="40" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.9" />
      <path d="M 40 19 L 40 30" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <rect x="32" y="30" width="16" height="10" rx="2" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
      <path d="M 36 40 L 18 52" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round" />
      <path d="M 44 40 L 62 52" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round" />
      <path d="M 40 40 L 40 52" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" strokeDasharray="3 2" />
      <rect x="10" y="52" width="16" height="10" rx="2" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <rect x="32" y="52" width="16" height="10" rx="2" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
      <rect x="54" y="52" width="16" height="10" rx="2" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <path d="M 18 62 L 14 70" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
      <path d="M 22 62 L 26 70" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
      <path d="M 58 62 L 54 70" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
      <path d="M 62 62 L 66 70" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
    </svg>
  )
}

function IconLinkedTarget() {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden className={styles.svg}>
      <circle cx="22" cy="40" r="14" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.7" />
      <circle cx="22" cy="40" r="8"  stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <circle cx="22" cy="40" r="3"  fill="currentColor" fillOpacity="0.8" />
      <path d="M 36 40 L 48 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M 45 37 L 48 40 L 45 43" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" />
      <rect x="52" y="28" width="20" height="24" rx="3" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.7" />
      <line x1="58" y1="36" x2="66" y2="36" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="58" y1="40" x2="64" y2="40" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
      <line x1="58" y1="44" x2="66" y2="44" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" />
    </svg>
  )
}

function IconBenchmark() {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden className={styles.svg}>
      <line x1="8"  y1="72" x2="72" y2="72" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
      <line x1="8"  y1="55" x2="72" y2="55" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="4 3" />
      <line x1="8"  y1="38" x2="72" y2="38" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="4 3" />
      <path d="M 14 72 L 28 44 L 42 58 L 56 28 L 70 38" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.75" />
      <circle cx="14" cy="72" r="2.5" fill="currentColor" fillOpacity="0.7" />
      <circle cx="28" cy="44" r="2.5" fill="currentColor" fillOpacity="0.7" />
      <circle cx="42" cy="58" r="2.5" fill="currentColor" fillOpacity="0.7" />
      <circle cx="56" cy="28" r="2.5" fill="currentColor" fillOpacity="0.7" />
      <circle cx="70" cy="38" r="2.5" fill="currentColor" fillOpacity="0.7" />
      <path d="M 14 72 L 28 52 L 42 62 L 56 40 L 70 48" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3" strokeDasharray="4 3" />
    </svg>
  )
}

function IconProcessChain() {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden className={styles.svg}>
      <rect x="6"  y="33" width="14" height="14" rx="2.5" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.8" />
      <rect x="28" y="28" width="14" height="24" rx="2.5" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.7" />
      <rect x="50" y="33" width="14" height="14" rx="2.5" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.6" />
      <path d="M 20 40 L 28 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M 42 40 L 50 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M 25 37 L 28 40 L 25 43" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" />
      <path d="M 47 37 L 50 40 L 47 43" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" />
      <circle cx="64" cy="60" r="8" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
      <path d="M 62 60 Q 62 56 66 58 Q 70 56 70 60 Q 70 64 64 67 Q 58 64 58 60 Q 58 56 62 58 Z" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" fill="none" />
      <line x1="64" y1="47" x2="64" y2="52" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="2 2" />
    </svg>
  )
}

// ── Connecting SVG overlay ────────────────────────────────────────

function ConnectingLines() {
  return (
    <svg
      className={styles.connectingLines}
      viewBox="0 0 1200 400"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* Top row connections: zone 1 → zone 2, zone 2 → zone 3 */}
      <path d="M 200 120 Q 350 100 380 120" stroke="white" strokeWidth="1" strokeOpacity="0.05" strokeDasharray="6 4" />
      <path d="M 580 120 Q 730 100 760 120" stroke="white" strokeWidth="1" strokeOpacity="0.05" strokeDasharray="6 4" />
      {/* Cross connections: top row → bottom row */}
      <path d="M 200 200 Q 360 280 420 260" stroke="white" strokeWidth="1" strokeOpacity="0.04" strokeDasharray="6 4" />
      <path d="M 800 200 Q 800 260 780 260" stroke="white" strokeWidth="1" strokeOpacity="0.04" strokeDasharray="6 4" />
      {/* Bottom row connection */}
      <path d="M 620 300 Q 700 280 740 300" stroke="white" strokeWidth="1" strokeOpacity="0.05" strokeDasharray="6 4" />
    </svg>
  )
}

// ── Data ──────────────────────────────────────────────────────────

const ZONES = [
  {
    title: t({ ru: 'Текущая структура токеномики', en: 'Current tokenomics structure' }),
    description: t({
      ru: 'Проверяем эмиссию, utility, вестинг, распределение пулов и экономические взаимосвязи.',
      en: 'We check emission, utility, vesting, pool distribution, and economic relationships within the model.',
    }),
    Icon: IconTokenMap,
  },
  {
    title: t({ ru: 'Расчёты, прогнозы и сценарии', en: 'Calculations, forecasts, and scenarios' }),
    description: t({
      ru: 'Пересматриваем формулы, допущения и ключевые сценарии, чтобы выявить ошибки.',
      en: 'We review formulas, assumptions, and key scenarios to identify errors and weaknesses.',
    }),
    Icon: IconScenarios,
  },
  {
    title: t({ ru: 'Связь модели с целями проекта', en: "Model's connection to project goals" }),
    description: t({
      ru: 'Смотрим, насколько токеномика соответствует логике продукта и задачам бизнеса.',
      en: 'We assess how well the tokenomics aligns with product logic, metrics, and current business objectives.',
    }),
    Icon: IconLinkedTarget,
  },
  {
    title: t({ ru: 'Рынок и конкуренты', en: 'Market and competitors' }),
    description: t({
      ru: 'Сравниваем модель с лучшими практиками и смотрим, где она уступает, а где даёт преимущество.',
      en: 'We compare the model with best practices and see where it falls short of the market and where it gives the project an advantage.',
    }),
    Icon: IconBenchmark,
  },
  {
    title: t({ ru: 'Критичные бизнес-процессы', en: 'Critical business processes' }),
    description: t({
      ru: 'Разбираем детали с CEO, CTO, CFO, чтобы увидеть риски, невидимые только по документам.',
      en: "We analyze details together with the CEO, CTO, CFO, and other process owners to see risks that aren't visible from documents alone.",
    }),
    Icon: IconProcessChain,
  },
]

// ── Component ─────────────────────────────────────────────────────

interface AuditZonesBlockProps {
  label?: string
  headline: string
  description?: string
}

export function AuditZonesBlock({ label, headline, description }: AuditZonesBlockProps) {
  return (
    <section className={styles.section} aria-label={t({ ru: 'Что мы проверяем', en: 'What we check' })}>
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

        <div className={styles.field}>

          <div className={styles.topRow}>
            {ZONES.slice(0, 3).map((zone, i) => {
              const { Icon } = zone
              return (
                <motion.article
                  key={i}
                  className={styles.zone}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                >
                  <div className={styles.zoneBorder} aria-hidden />
                  <div className={styles.zoneIcon}>
                    <Icon />
                  </div>
                  <div className={styles.zoneContent}>
                    <h3 className={styles.zoneTitle}>{zone.title}</h3>
                    <p className={styles.zoneDesc}>{zone.description}</p>
                  </div>
                </motion.article>
              )
            })}
          </div>

          <div className={styles.bottomRow}>
            {ZONES.slice(3).map((zone, i) => {
              const { Icon } = zone
              return (
                <motion.article
                  key={i + 3}
                  className={styles.zone}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, ease, delay: 0.24 + i * 0.08 }}
                >
                  <div className={styles.zoneBorder} aria-hidden />
                  <div className={styles.zoneIcon}>
                    <Icon />
                  </div>
                  <div className={styles.zoneContent}>
                    <h3 className={styles.zoneTitle}>{zone.title}</h3>
                    <p className={styles.zoneDesc}>{zone.description}</p>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
