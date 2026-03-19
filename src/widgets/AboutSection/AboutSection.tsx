'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { aboutContent, teamContent } from '@/shared/content/homePage'
import styles from './AboutSection.module.scss'

// Animated counter for stats
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      className={styles.stat}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </motion.div>
  )
}

export function AboutSection() {
  return (
    <section className={styles.section} aria-label="О компании">
      <div className={styles.inner}>
        {/* Left: label + quote */}
        <motion.div
          className={styles.quoteCol}
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <span className={styles.label}>
            <span className={styles.labelBracket}>[</span>
            {aboutContent.label}
            <span className={styles.labelBracket}>]</span>
          </span>

          <div className={styles.quoteWrap}>
            <span className={styles.quoteMark} aria-hidden="true">&quot;</span>
            <blockquote className={styles.quote}>
              {/* Strip outer guillemets for clean rendering */}
              {aboutContent.quote.replace(/^«|»$/g, '')}
            </blockquote>
          </div>

          <p className={styles.attribution}>— {aboutContent.attribution}</p>

          <div className={styles.team}>
            {teamContent.members.map((member, i) => (
              <motion.div
                key={member.photo}
                className={styles.avatarWrap}
                style={{ zIndex: teamContent.members.length - i }}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: 0.25 + i * 0.06 }}
              >
                <div className={styles.avatar} aria-hidden="true">
                  <Image
                    src={member.photo}
                    alt=""
                    fill
                    sizes="52px"
                    className={styles.avatarImg}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: stats grid */}
        <div className={styles.statsCol}>
          <div className={styles.statsGrid}>
            {aboutContent.stats.map((stat, i) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}
              >
                <AnimatedStat value={stat.value} label={stat.label} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
