'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { servicesContent } from '@/shared/content/homePage'
import { ScrollRevealText } from '@/shared/ui'
import styles from './ServicesSection.module.scss'

const accentStyles = {
  purple: styles.accentPurple,
  green: styles.accentGreen,
  blue: styles.accentBlue,
}

const ServiceIcon = ({ id }: { id: string }) => {
  if (id === 'strategic-consulting') {
    return (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="23" y="4" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="4" y="23" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M23 29.5h13M29.5 23v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 10.5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (id === 'tokenomics') {
    return (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 6v4M20 30v4M6 20h4M30 20h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10.1 10.1l2.8 2.8M27.1 27.1l2.8 2.8M27.1 10.1l-2.8 2.8M10.1 27.1l2.8 2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4h15l9 9v23a2 2 0 01-2 2H10a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M25 4v9h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 22h14M13 28h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="29" cy="28" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M33 32l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function ServicesSection() {
  return (
    <section className={styles.section} id="services" aria-label="Услуги">
      <div className={styles.inner}>
        {/* Section header */}
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
              All services <span aria-hidden="true">→</span>
            </Link>
          </div>
        </motion.div>

        {/* Cards */}
        <div className={styles.grid}>
          {servicesContent.items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.09 }}
            >
              <Link
                href={item.href}
                className={`${styles.card} ${accentStyles[item.accentColor as keyof typeof accentStyles]}`}
              >
                {/* Accent top border on hover */}
                <div className={styles.cardTopBorder} aria-hidden="true" />

                {/* Card number */}
                <span className={styles.cardNumber} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Small foreground icon */}
                <div className={styles.iconSmall} aria-hidden="true">
                  <ServiceIcon id={item.id} />
                </div>

                {/* Large background watermark icon */}
                <div className={styles.cardBgIcon} aria-hidden="true">
                  <ServiceIcon id={item.id} />
                </div>

                {/* Content */}
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDescription}>{item.description}</p>
                </div>

                {/* Footer */}
                <div className={styles.cardFooter}>
                  <span className={styles.cardLink}>Learn more</span>
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
