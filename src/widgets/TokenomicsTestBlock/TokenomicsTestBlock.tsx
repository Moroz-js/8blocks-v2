'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { t } from '@/shared/i18n'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import { tokenomicsTestContent } from '@/shared/content/homePage'
import styles from './TokenomicsTestBlock.module.scss'

const ease = 'easeOut' as const

const SCREENS = [
  {
    src: '/img/miniapp-1.png',
    alt: t({ ru: 'Token Lab — главный экран', en: 'Token Lab — main screen' }),
    title: t({ ru: 'Базовая модель', en: 'Base model' }),
    description: t({
      ru: 'Задайте объем токенов, цену, циркуляцию и аллокации, чтобы быстро увидеть базовую картину по токеномике',
      en: 'Set token supply, price, circulation, and allocations to get a quick baseline view of your tokenomics.',
    }),
  },
  {
    src: '/img/miniapp-2.png',
    alt: t({ ru: 'Allocation — распределение токенов', en: 'Allocation — token distribution' }),
    title: t({ ru: 'Аллокация', en: 'Allocation' }),
    description: t({
      ru: 'Распределите токены между командой, инвесторами, комьюнити и экосистемой — наглядно и с контролем процентов',
      en: 'Distribute tokens across team, investors, community, and ecosystem with clear visuals and percentage control.',
    }),
  },
  {
    src: '/img/miniapp-3.png',
    alt: t({ ru: 'Vesting — настройка разлоков', en: 'Vesting — unlock schedule setup' }),
    title: t({ ru: 'Вестинг и разлоки', en: 'Vesting and unlocks' }),
    description: t({
      ru: 'Настройте разлоки по каждому пулу, посмотрите графики анлоков, возможные всплески и общее состояние модели',
      en: 'Configure unlocks for each pool, review unlock charts, spot potential spikes, and assess overall model health.',
    }),
  },
  {
    src: '/img/miniapp-4.png',
    alt: t({ ru: 'Scoring — итоговая оценка', en: 'Scoring — final evaluation' }),
    title: t({ ru: 'Итоговая оценка', en: 'Final score' }),
    description: t({
      ru: 'Получите срез модели с кратким выводом о рисках и качестве токеномики, графиком вестинга и рекомендациями',
      en: 'Get a model snapshot with a concise risk and quality assessment, vesting chart, and actionable recommendations.',
    }),
  },
]

export function TokenomicsTestBlock() {
  const { headline, description, ctaLabel, ctaHref } = tokenomicsTestContent

  return (
    <section className={styles.section} aria-label={t({ ru: 'Тест токеномики', en: 'Tokenomics test' })}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
        >
          <ScrollRevealText text={headline} className={styles.headline} />
          <p className={styles.description}>{description}</p>
        </motion.div>

        <div className={styles.rows}>
          {SCREENS.map((screen, i) => {
            const reversed = i % 2 !== 0
            return (
              <motion.div
                key={i}
                className={`${styles.row} ${reversed ? styles.rowReversed : ''}`}
                initial={{ opacity: 0, x: reversed ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease, delay: 0.05 }}
              >
                <div className={styles.imageCol}>
                  <div className={styles.phone}>
                    <Image
                      src={screen.src}
                      alt={screen.alt}
                      width={390}
                      height={844}
                      className={styles.phoneScreen}
                      quality={85}
                    />
                  </div>
                </div>

                <div className={styles.textCol}>
                  <span className={styles.step}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className={styles.rowTitle}>{screen.title}</h3>
                  <p className={styles.rowDesc}>{screen.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          className={styles.ctaWrap}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
        >
          <Link
            href={ctaHref}
            className={styles.cta}
            target="_blank"
            rel="noopener noreferrer"
          >
            {ctaLabel}
            <span className={styles.ctaArrow} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
