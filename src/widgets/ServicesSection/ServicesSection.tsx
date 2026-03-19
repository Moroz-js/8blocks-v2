'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { servicesContent } from '@/shared/content/homePage'
import { ScrollRevealText } from '@/shared/ui'
import styles from './ServicesSection.module.scss'

export function ServicesSection() {
  return (
    <section className={styles.section} id="services" aria-label="Услуги">
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <span className={styles.label}>
            <span className={styles.labelBracket}>[</span>
            {servicesContent.label}
            <span className={styles.labelBracket}>]</span>
          </span>
          <div className={styles.headerRow}>
            <ScrollRevealText
              text={servicesContent.headline.replace('\n', ' ')}
              className={styles.headline}
              startOffset="start 0.85"
              endOffset="end 0.45"
            />
            <Link href="/services" className={styles.viewAll}>
              Все услуги <span aria-hidden="true">→</span>
            </Link>
          </div>
        </motion.div>

        <div className={styles.grid}>
          {servicesContent.items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.09 }}
            >
              <Link href={item.href} className={styles.card}>
                <div className={styles.cardBorderGlow} aria-hidden="true" />

                <span className={styles.cardNumber} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDescription}>{item.description}</p>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.cardLink}>Подробнее</span>
                  <span className={styles.cardArrow} aria-hidden="true">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
