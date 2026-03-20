'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from './ConsultingDeliverablesWall.module.scss'

const ease = 'easeOut' as const

// ── Icons ────────────────────────────────────────────────────────

function IconTokenomics() {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden className={styles.svg}>
      <rect x="8"  y="28" width="64" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.8" />
      <rect x="14" y="44" width="48" height="9"  rx="2" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.6" />
      <rect x="22" y="58" width="32" height="8"  rx="2" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
      <rect x="32" y="70" width="16" height="6"  rx="2" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.3" />
      <path d="M 14 18 L 40 8 L 66 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" />
      <circle cx="40" cy="8" r="3" fill="currentColor" fillOpacity="0.8" />
    </svg>
  )
}

function IconWhitePaper() {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden className={styles.svg}>
      <rect x="16" y="8"  width="48" height="64" rx="3" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.7" />
      <path d="M 40 8 L 40 22 L 64 22" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.4" />
      <rect x="40" y="8" width="24" height="14" rx="0 3 0 0" fill="currentColor" fillOpacity="0.05" />
      <line x1="24" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
      <line x1="24" y1="40" x2="50" y2="40" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.35" />
      <line x1="24" y1="48" x2="56" y2="48" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.3" />
      <line x1="24" y1="56" x2="44" y2="56" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.25" />
    </svg>
  )
}

function IconPitchDeck() {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden className={styles.svg}>
      <rect x="8"  y="14" width="64" height="44" rx="3" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.7" />
      <line x1="8"  y1="26" x2="72" y2="26" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
      <rect x="16" y="32" width="24" height="18" rx="2" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
      <path d="M 20 46 L 26 36 L 32 42 L 36 38" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" />
      <line x1="46" y1="34" x2="64" y2="34" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
      <line x1="46" y1="40" x2="60" y2="40" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.3" />
      <line x1="46" y1="46" x2="64" y2="46" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.25" />
      <path d="M 36 58 L 40 66 L 44 58" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" />
    </svg>
  )
}

function IconPartners() {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden className={styles.svg}>
      <circle cx="16" cy="40" r="8" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.7" />
      <circle cx="40" cy="20" r="8" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.7" />
      <circle cx="64" cy="40" r="8" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.7" />
      <circle cx="40" cy="60" r="8" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.7" />
      <line x1="24" y1="35" x2="33" y2="26" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
      <line x1="48" y1="26" x2="56" y2="35" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
      <line x1="56" y1="45" x2="48" y2="54" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
      <line x1="32" y1="54" x2="24" y2="45" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
      <circle cx="40" cy="40" r="5" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.6" />
    </svg>
  )
}

function IconListing() {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden className={styles.svg}>
      <path d="M 40 70 L 40 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
      <path d="M 40 20 L 30 32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
      <path d="M 40 20 L 50 32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
      <circle cx="40" cy="20" r="4" fill="currentColor" fillOpacity="0.85" />
      <line x1="14" y1="56" x2="66" y2="56" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="14" y1="64" x2="66" y2="64" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="4 3" />
      <circle cx="20" cy="42" r="3" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
      <circle cx="32" cy="32" r="3" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <circle cx="52" cy="36" r="3" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
      <circle cx="62" cy="28" r="3" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.55" />
    </svg>
  )
}

function IconAdvisory() {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden className={styles.svg}>
      <circle cx="40" cy="38" r="24" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.6" />
      <circle cx="26" cy="30" r="6" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.7" />
      <circle cx="54" cy="30" r="6" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.7" />
      <path d="M 30 36 Q 40 44 50 36" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.5" fill="none" />
      <path d="M 32 52 Q 40 60 48 52" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.4" fill="none" />
      <line x1="26" y1="36" x2="26" y2="44" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.35" strokeDasharray="2 2" />
      <line x1="54" y1="36" x2="54" y2="44" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.35" strokeDasharray="2 2" />
    </svg>
  )
}

// ── Data ──────────────────────────────────────────────────────────

const DELIVERABLES = [
  {
    title: 'Токеномика проекта',
    description: 'Разрабатываем полную модель: утилизацию токена, распределение, клейф, вестинг и эмиссию.',
    bullets: ['Эмиссия и распределение', 'Вестинг и клиффы', 'Utility-механики', 'Treasury и резервы'],
    group: 'главный результат',
    Icon: IconTokenomics,
    large: true,
  },
  {
    title: 'White Paper',
    description: 'Описываем концепцию проекта, логику токена и принципы экосистемы.',
    bullets: ['Концепция и архитектура', 'Экономическая логика', 'Технические детали'],
    group: 'материалы',
    Icon: IconWhitePaper,
    large: false,
  },
  {
    title: 'Pitch Deck',
    description: 'Готовим презентацию и дополнительные материалы для инвесторов.',
    bullets: ['Инвест-нарратив', 'Ключевые метрики', 'Roadmap'],
    group: 'материалы',
    Icon: IconPitchDeck,
    large: false,
  },
  {
    title: 'Партнёрская стратегия',
    description: 'Подбираем партнёров по ключевым направлениям и организуем встречи.',
    bullets: ['Маркетмейкинг', 'Маркетинг партнёры', 'Технические подрядчики'],
    group: 'выход в рынок',
    Icon: IconPartners,
    large: false,
    wide: true,
  },
  {
    title: 'Листинг и выход',
    description: 'Помогаем с подготовкой к размещению токена на биржах.',
    bullets: ['CEX/DEX стратегия', 'Liquidity plan', 'Launch checklist'],
    group: 'выход в рынок',
    Icon: IconListing,
    large: false,
  },
  {
    title: 'Консультационная поддержка',
    description: 'До 10 звонков в месяц по 90 минут с нашими экспертами на протяжении всего проекта.',
    bullets: ['Экспертные звонки', 'Контроль результата', 'Поддержка команды'],
    group: 'сопровождение',
    Icon: IconAdvisory,
    large: false,
  },
]

// ── Component ─────────────────────────────────────────────────────

interface ConsultingDeliverablesWallProps {
  headline: string
  ctaHeadline: string
  ctaDescription: string
  ctaLabel: string
  ctaHref: string
}

export function ConsultingDeliverablesWall({
  headline,
  ctaHeadline,
  ctaDescription,
  ctaLabel,
  ctaHref,
}: ConsultingDeliverablesWallProps) {
  return (
    <section className={styles.section} aria-label="Результаты консалтинга">
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
          {DELIVERABLES.map((item, i) => {
            const { Icon } = item
            return (
              <motion.article
                key={i}
                className={`${styles.card} ${item.large ? styles.cardLarge : ''} ${item.wide ? styles.cardWide : ''}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.06 }}
              >
                <div className={styles.cardTopBorder} aria-hidden />
                <div className={styles.cardIcon}>
                  <Icon />
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.description}</p>
                  <ul className={styles.bullets}>
                    {item.bullets.map((b, j) => (
                      <li key={j} className={styles.bullet}>
                        <span className={styles.bulletDot} aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            )
          })}
        </div>

        <motion.div
          className={styles.cta}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.55, ease, delay: 0.1 }}
        >
          <h2 className={styles.ctaHeadline}>{ctaHeadline}</h2>
          <p className={styles.ctaText}>{ctaDescription}</p>
          <Link href={ctaHref} className={styles.ctaButton}>
            {ctaLabel}
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
