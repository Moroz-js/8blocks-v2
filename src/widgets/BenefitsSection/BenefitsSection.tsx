'use client'

import { Fragment, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { benefitsContent } from '@/shared/content/homePage'
import { ScrollRevealText } from '@/shared/ui'
import styles from './BenefitsSection.module.scss'

const REVEAL_TEXT = `${benefitsContent.headlinePart1} ${benefitsContent.headlinePart2} ${benefitsContent.headlinePart3.replace('\n', ' ')}`
const STICKY_TOP = 340
const items = benefitsContent.items

function StackCard({ item, index }: {
  item: (typeof items)[number]
  index: number
}) {
  const isLast = index === items.length - 1
  const spacerRef = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { scrollYProgress } = useScroll({ target: spacerRef, offset: ['start end', 'end start'] } as any)

  const scale = useTransform(scrollYProgress, (v) => {
    if (isLast) return 1
    const p = Math.max(0, Math.min(1, v))
    return 1.03 - p * 0.09
  })

  // Текст раскрывается за первую половину маршрута спайсера, чтобы успевать заполняться до конца
  const textProgress = useTransform(scrollYProgress, (v) => Math.min(1, v * 2))

  return (
    <Fragment>
      <motion.div
        className={styles.card}
        style={{
          position: 'sticky',
          top: STICKY_TOP,
          zIndex: index + 1,
          scale,
        }}
      >
        <div className={styles.cardInner}>
          <span className={styles.cardNumber}>
            {String(index + 1).padStart(2, '0')}
          </span>

          <h3 className={styles.cardTitle}>{item.title}</h3>

          <ScrollRevealText
            text={item.description}
            className={styles.cardDescription}
            dark
            progress={textProgress}
          />
        </div>
      </motion.div>
      <div ref={spacerRef} className={isLast ? styles.spacerLast : styles.spacer} />
    </Fragment>
  )
}

export function BenefitsSection() {
  return (
    <section className={styles.section} aria-label={benefitsContent.ariaLabel}>
      <div className={styles.stack}>
        <div className={styles.header}>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className={styles.labelBracket}>[</span>
            {benefitsContent.label}
            <span className={styles.labelBracket}>]</span>
          </motion.span>

          <ScrollRevealText
            text={REVEAL_TEXT}
            className={styles.headline}
            startOffset="start 0.82"
            endOffset="end 0.4"
          />

          <motion.div
            className={styles.decorLine}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            style={{ transformOrigin: 'left center' }}
            aria-hidden="true"
          />
        </div>

        {items.map((item, i) => (
          <StackCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
