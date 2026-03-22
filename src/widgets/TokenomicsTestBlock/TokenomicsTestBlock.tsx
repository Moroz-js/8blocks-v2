'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import { tokenomicsTestContent } from '@/shared/content/homePage'
import styles from './TokenomicsTestBlock.module.scss'

const ease = 'easeOut' as const

const SCREENS = [
  {
    src: '/img/miniapp-1.png',
    alt: 'Token Lab — главный экран',
    title: 'Базовая модель',
    description:
      'Задайте объем токенов, цену, циркуляцию и аллокации, чтобы быстро увидеть базовую картину по токеномике',
  },
  {
    src: '/img/miniapp-2.png',
    alt: 'Allocation — распределение токенов',
    title: 'Аллокация',
    description:
      'Распределите токены между командой, инвесторами, комьюнити и экосистемой — наглядно и с контролем процентов',
  },
  {
    src: '/img/miniapp-3.png',
    alt: 'Vesting — настройка разлоков',
    title: 'Вестинг и разлоки',
    description:
      'Настройте разлоки по каждому пулу, посмотрите графики анлоков, возможные всплески и общее состояние модели',
  },
  {
    src: '/img/miniapp-4.png',
    alt: 'Scoring — итоговая оценка',
    title: 'Итоговая оценка',
    description:
      'Получите срез модели с кратким выводом о рисках и качестве токеномики, графиком вестинга и рекомендациями',
  },
]

export function TokenomicsTestBlock() {
  const { headline, description, ctaLabel, ctaHref } = tokenomicsTestContent

  return (
    <section className={styles.section} aria-label="Тест токеномики">
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
