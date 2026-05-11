'use client'

import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import { PartnersSection } from '@/widgets/PartnersSection'
import styles from './WorkshopTestimonial.module.scss'

const ease = 'easeOut' as const

interface TrustStat {
  value: string
  label: string
}

interface WorkshopTestimonialProps {
  testimonial: {
    quote: string
    date: string
    dateIso: string
    roleLead: string
    clientName: string
    clientUrl: string
    author: string
  }
  trust: {
    slots: {
      headline: string
      description: string
    }
    stats: readonly TrustStat[]
    geo: string
  }
}

export function WorkshopTestimonial({ testimonial, trust }: WorkshopTestimonialProps) {
  return (
    <section className={styles.section} aria-label="Testimonial and trust">
      <div className={styles.inner}>

        {/* Row 1: quote left + slots/stats right */}
        <div className={styles.topGrid}>
          <motion.blockquote
            className={styles.testimonial}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease }}
          >
            <div className={styles.quoteIcon} aria-hidden="true">"</div>
            <p className={styles.quoteText}>{testimonial.quote}</p>
            <footer className={styles.quoteFooter}>
              <time className={styles.quoteDate} dateTime={testimonial.dateIso}>
                {testimonial.date}
              </time>
              <p className={styles.quoteRole}>
                {testimonial.roleLead},{' '}
                <a
                  href={testimonial.clientUrl}
                  className={styles.quoteClientLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {testimonial.clientName}
                </a>
              </p>
              <cite className={styles.quoteAuthor}>{testimonial.author}</cite>
            </footer>
          </motion.blockquote>

          <div className={styles.trustBlock}>
            <div className={styles.slots}>
              <ScrollRevealText text={trust.slots.headline} className={styles.slotsHeadline} />
              <ScrollRevealText text={trust.slots.description} className={styles.slotsDesc} />
            </div>

            <div className={styles.statsGrid}>
              {trust.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  className={styles.stat}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.45, ease, delay: i * 0.07 }}
                >
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </motion.div>
              ))}
            </div>

            <motion.p
              className={styles.geo}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, ease, delay: 0.2 }}
            >
              {trust.geo}
            </motion.p>
          </div>
        </div>

        {/* Row 2: partners marquee full width */}
        <PartnersSection />

      </div>
    </section>
  )
}
