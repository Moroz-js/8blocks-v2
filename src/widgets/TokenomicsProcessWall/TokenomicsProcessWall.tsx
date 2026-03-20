'use client'

import { motion } from 'framer-motion'
import styles from './TokenomicsProcessWall.module.scss'

const ease = 'easeOut' as const

// ── SVG icons ─────────────────────────────────────────────────────

function IconImmerse() {
  // layered documents / stacked context blocks
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden className={styles.cardSvg}>
      <rect x="8"  y="46" width="52" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.85" />
      <rect x="12" y="32" width="44" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
      <rect x="16" y="18" width="36" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.4" />
      <rect x="20" y="6"  width="28" height="16" rx="2.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
      <line x1="16" y1="55" x2="52" y2="55" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 3" />
    </svg>
  )
}

function IconBenchmark() {
  // comparison bars / mirrored charts
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden className={styles.cardSvg}>
      <line x1="36" y1="8" x2="36" y2="64" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
      <rect x="12" y="20" width="20" height="8"  rx="1.5" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.8" />
      <rect x="12" y="32" width="14" height="8"  rx="1.5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
      <rect x="12" y="44" width="18" height="8"  rx="1.5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <rect x="40" y="20" width="22" height="8"  rx="1.5" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.8" />
      <rect x="40" y="32" width="16" height="8"  rx="1.5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
      <rect x="40" y="44" width="20" height="8"  rx="1.5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="8"  y1="14" x2="64" y2="14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="3 3" />
      <line x1="8"  y1="58" x2="64" y2="58" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="3 3" />
    </svg>
  )
}

function IconTeam() {
  // connected discussion nodes
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden className={styles.cardSvg}>
      <circle cx="16" cy="28" r="9"  fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.8" />
      <circle cx="56" cy="28" r="9"  fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.8" />
      <circle cx="36" cy="52" r="9"  fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.7" />
      <line x1="25" y1="28" x2="47" y2="28" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
      <line x1="22" y1="35" x2="30" y2="44" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
      <line x1="50" y1="35" x2="42" y2="44" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
      <circle cx="36" cy="28" r="3.5" fill="currentColor" fillOpacity="0.5" />
    </svg>
  )
}

function IconRules() {
  // rule grid / token permissions matrix
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden className={styles.cardSvg}>
      <rect x="8"  y="8"  width="26" height="20" rx="2" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.8" />
      <rect x="38" y="8"  width="26" height="20" rx="2" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
      <rect x="8"  y="33" width="26" height="20" rx="2" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
      <rect x="38" y="33" width="26" height="20" rx="2" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.45" />
      <line x1="8"  y1="58" x2="64" y2="58" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <path d="M 12 17 L 16 21 L 24 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
      <path d="M 42 17 L 46 21 L 54 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.55" />
      <line x1="42" y1="43" x2="60" y2="43" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.4" />
      <line x1="42" y1="47" x2="55" y2="47" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
    </svg>
  )
}

function IconEcosystem() {
  // ecosystem loop / linked modules
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden className={styles.cardSvg}>
      <circle cx="36" cy="36" r="22" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
      <rect x="10" y="28" width="14" height="14" rx="2.5" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.8" />
      <rect x="49" y="16" width="14" height="14" rx="2.5" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.7" />
      <rect x="49" y="42" width="14" height="14" rx="2.5" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.65" />
      <rect x="29" y="52" width="14" height="14" rx="2.5" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
      <path d="M 24 35 Q 34 28 49 23" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M 56 30 Q 58 42 56 49" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.45" />
      <path d="M 49 52 Q 42 58 36 59" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M 29 59 Q 22 52 22 43" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  )
}

function IconTokenFlow() {
  // circular token flow
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden className={styles.cardSvg}>
      <circle cx="36" cy="36" r="24" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
      <circle cx="36" cy="12" r="5"  fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.9" />
      <circle cx="60" cy="36" r="5"  fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.75" />
      <circle cx="36" cy="60" r="5"  fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.65" />
      <circle cx="12" cy="36" r="5"  fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
      <path d="M 40 16 Q 56 22 55 31" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" markerEnd="url(#arrFlow)" strokeOpacity="0.55" />
      <path d="M 57 41 Q 50 56 41 57" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M 31 57 Q 16 50 13 41" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.45" />
      <path d="M 13 31 Q 18 16 32 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5" />
      <circle cx="36" cy="36" r="4"  fill="currentColor" fillOpacity="0.7" />
      <defs>
        <marker id="arrFlow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M 0 0 L 5 2.5 L 0 5 Z" fill="rgba(255,255,255,0.55)" />
        </marker>
      </defs>
    </svg>
  )
}

function IconSale() {
  // staged sale timeline
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden className={styles.cardSvg}>
      <line x1="8"  y1="56" x2="64" y2="56" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" />
      <rect x="8"  y="44" width="12" height="12" rx="2" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.8" />
      <rect x="26" y="32" width="12" height="24" rx="2" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.7" />
      <rect x="44" y="20" width="12" height="36" rx="2" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.6" />
      <circle cx="14" cy="44"  r="2.5" fill="currentColor" fillOpacity="0.8" />
      <circle cx="32" cy="32"  r="2.5" fill="currentColor" fillOpacity="0.75" />
      <circle cx="50" cy="20"  r="2.5" fill="currentColor" fillOpacity="0.7" />
      <path d="M 14 44 L 32 32 L 50 20" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeDasharray="4 3" />
      <path d="M 20 12 L 58 12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="3 3" />
    </svg>
  )
}

function IconAdapt() {
  // flexible branching structure
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden className={styles.cardSvg}>
      <circle cx="10" cy="36" r="4.5" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.85" />
      <line x1="14.5" y1="36" x2="30" y2="20" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.55" strokeLinecap="round" />
      <line x1="14.5" y1="36" x2="30" y2="36" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round" />
      <line x1="14.5" y1="36" x2="30" y2="52" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" strokeLinecap="round" />
      <circle cx="34" cy="20" r="4" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.7" />
      <circle cx="34" cy="36" r="4" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.65" />
      <circle cx="34" cy="52" r="4" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
      <line x1="38" y1="20" x2="52" y2="14" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.4" strokeLinecap="round" />
      <line x1="38" y1="20" x2="52" y2="26" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.35" strokeLinecap="round" />
      <line x1="38" y1="36" x2="52" y2="36" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.4" strokeLinecap="round" />
      <line x1="38" y1="52" x2="52" y2="46" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.35" strokeLinecap="round" />
      <line x1="38" y1="52" x2="52" y2="58" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.3" strokeLinecap="round" />
      <line x1="56" y1="14" x2="64" y2="14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
      <line x1="56" y1="26" x2="64" y2="26" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" strokeLinecap="round" />
      <line x1="56" y1="36" x2="64" y2="36" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
      <line x1="56" y1="46" x2="64" y2="46" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" strokeLinecap="round" />
      <line x1="56" y1="58" x2="64" y2="58" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" strokeLinecap="round" />
    </svg>
  )
}

function IconFinalize() {
  // shielded framework / locked model frame
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden className={styles.cardSvgFinal}>
      <path d="M 36 8 L 60 18 L 60 38 Q 60 56 36 64 Q 12 56 12 38 L 12 18 Z" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.7" strokeLinejoin="round" />
      <path d="M 36 14 L 54 22 L 54 38 Q 54 52 36 59 Q 18 52 18 38 L 18 22 Z" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.4" strokeLinejoin="round" />
      <rect x="27" y="30" width="18" height="16" rx="2.5" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.75" />
      <path d="M 29 30 L 29 26 Q 29 22 36 22 Q 43 22 43 26 L 43 30" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" fill="none" />
      <circle cx="36" cy="38" r="2.5" fill="currentColor" fillOpacity="0.8" />
    </svg>
  )
}

// ── Data ──────────────────────────────────────────────────────────

const STEPS = [
  {
    num: '01',
    title: 'Погружаемся в проект',
    description: 'Изучаем материалы, цели и контекст, чтобы понять задачи проекта и логику продукта.',
    Icon: IconImmerse,
  },
  {
    num: '02',
    title: 'Проводим бенчмаркинг',
    description: 'Анализируем токеномики конкурентов, сравниваем модели и выделяем сильные решения.',
    Icon: IconBenchmark,
  },
  {
    num: '03',
    title: 'Работаем с командой',
    description: 'Проводим совместные сессии, чтобы учесть нюансы продукта и собрать сильную модель.',
    Icon: IconTeam,
  },
  {
    num: '04',
    title: 'Формируем правила использования токена',
    description: 'Определяем utility-механики, права держателей и условия вестинга.',
    Icon: IconRules,
  },
  {
    num: '05',
    title: 'Прорабатываем экосистему',
    description: 'Связываем токен с продуктом, интерфейсами и технической логикой проекта.',
    Icon: IconEcosystem,
  },
  {
    num: '06',
    title: 'Проектируем движение токена',
    description: 'Строим сценарии потоков токена между всеми элементами экосистемы.',
    Icon: IconTokenFlow,
  },
  {
    num: '07',
    title: 'Планируем продажу токенов',
    description: 'Определяем количество раундов, формат продажи, сроки и средний чек.',
    Icon: IconSale,
  },
  {
    num: '08',
    title: 'Адаптируем модель под новые механики',
    description: 'Тестируем дополнительные функции по мере развития проекта.',
    Icon: IconAdapt,
  },
  {
    num: '09',
    title: 'Финализируем и защищаем модель',
    description: 'Собираем итоговую токеномику, готовим презентацию и защищаем решение перед вашей командой.',
    Icon: IconFinalize,
    final: true,
  },
]

// ── Component ─────────────────────────────────────────────────────

interface TokenomicsProcessWallProps {
  headline: string
}

export function TokenomicsProcessWall({ headline }: TokenomicsProcessWallProps) {
  const rowA = STEPS.slice(0, 4)
  const rowB = STEPS.slice(4, 8)
  const final = STEPS[8]

  return (
    <section className={styles.section} aria-label="Процесс работы">
      <div className={styles.inner}>
        <motion.h2
          className={styles.headline}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease }}
        >
          {headline}
        </motion.h2>

        <div className={styles.wall}>
          {/* Row 1 — steps 01–04 */}
          <div className={styles.rowA}>
            {rowA.map((step, i) => {
              const { Icon } = step
              return (
                <motion.article
                  key={step.num}
                  className={styles.card}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.45, ease, delay: i * 0.07 }}
                >
                  <div className={styles.cardTopBorder} aria-hidden />
                  <div className={styles.cardHeader}>
                    <span className={styles.stepNum}>{step.num}</span>
                    <div className={styles.iconWrap} aria-hidden>
                      <Icon />
                    </div>
                  </div>
                  <h3 className={styles.cardTitle}>{step.title}</h3>
                  <p className={styles.cardDesc}>{step.description}</p>
                </motion.article>
              )
            })}
          </div>

          {/* Row 2 — steps 05–08, slightly offset */}
          <div className={styles.rowB}>
            {rowB.map((step, i) => {
              const { Icon } = step
              return (
                <motion.article
                  key={step.num}
                  className={styles.card}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.45, ease, delay: 0.28 + i * 0.07 }}
                >
                  <div className={styles.cardTopBorder} aria-hidden />
                  <div className={styles.cardHeader}>
                    <span className={styles.stepNum}>{step.num}</span>
                    <div className={styles.iconWrap} aria-hidden>
                      <Icon />
                    </div>
                  </div>
                  <h3 className={styles.cardTitle}>{step.title}</h3>
                  <p className={styles.cardDesc}>{step.description}</p>
                </motion.article>
              )
            })}
          </div>

          {/* Row 3 — step 09, final wide card */}
          <div className={styles.rowC}>
            <motion.article
              className={`${styles.card} ${styles.cardFinal}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: 0.1 }}
            >
              <div className={styles.cardTopBorder} aria-hidden />
              <div className={styles.cardFinalInner}>
                <div className={styles.cardFinalText}>
                  <span className={styles.stepNum}>{final.num}</span>
                  <h3 className={styles.cardTitle}>{final.title}</h3>
                  <p className={styles.cardDesc}>{final.description}</p>
                </div>
                <div className={styles.cardFinalIcon} aria-hidden>
                  <IconFinalize />
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  )
}
