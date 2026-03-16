'use client'

import { motion } from 'framer-motion'
import { ctaContent } from '@/shared/content/homePage'
import { ScrollRevealText } from '@/shared/ui'
import styles from './CtaSection.module.scss'

const CTA_REVEAL_TEXT = ctaContent.headline.replace('\n', ' ')

export function CtaSection() {
  return (
    <section className={styles.section} aria-label="Призыв к действию">
      <div className={styles.inner}>
        {/* Left: text */}
        <div className={styles.textCol}>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className={styles.labelBracket}>[</span>
            {ctaContent.label}
            <span className={styles.labelBracket}>]</span>
          </motion.span>

          <ScrollRevealText
            text={CTA_REVEAL_TEXT}
            className={styles.headline}
            startOffset="start 0.8"
            endOffset="end 0.45"
          />

          <motion.p
            className={styles.body}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
          >
            {ctaContent.body}
          </motion.p>
        </div>

        {/* Right: Telegram */}
        <motion.div
          className={styles.tgCol}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          <a
            href="https://t.me/8blocks_io"
            className={styles.tgLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message us on Telegram"
          >
            <div className={styles.tgGlow} aria-hidden="true" />
            <span className={styles.tgIcon} aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
                <path d="M11.3 16.4l-.4 5.3c.6 0 .8-.3 1.1-.6l2.7-2.6 5.6 4.1c1 .6 1.8.3 2-.9l3.6-17c.4-1.5-.5-2.1-1.5-1.7L1.9 11.2c-1.5.6-1.4 1.4-.3 1.8l5.7 1.8 13.3-8.4c.6-.4 1.2-.2.7.3L11.3 16.4z" fill="white"/>
              </svg>
            </span>
            <span className={styles.tgLabel}>Message us on Telegram</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
