'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { digitalAssetsContent } from '@/shared/content/digitalAssets'
import { SectionHead } from './SectionHead'
import styles from './DigitalAssets.module.scss'

const ease = 'easeOut' as const
const { about } = digitalAssetsContent

export function DigitalAssetsAbout() {
  return (
    <section className={styles.section} aria-label={about.label}>
      <div className={styles.inner}>
        <SectionHead label={about.label} headline={about.headline} />

        <div className={styles.aboutGrid}>
          {about.blocks.map((block, i) => (
            <motion.article
              key={block.title}
              className={styles.aboutBlock}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, ease, delay: (i % 4) * 0.06 }}
            >
              <h3 className={styles.aboutBlockTitle}>{block.title}</h3>
              <p className={styles.aboutBlockDescription}>{block.description}</p>
            </motion.article>
          ))}
        </div>

        <p className={styles.aboutNote}>{about.note}</p>

        <div className={styles.caseworkHead}>
          <span className={styles.caseworkLabel}>[{about.caseworkLabel}]</span>
          <Link href={about.allCasesHref} className={styles.textLink}>
            {about.allCasesLabel} →
          </Link>
        </div>

        <div className={styles.casesGrid}>
          {about.cases.map((item, i) => (
            <motion.div
              key={item.title}
              className={styles.caseCell}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, ease, delay: i * 0.08 }}
            >
              <Link href={about.allCasesHref} className={styles.caseCard}>
                <span className={styles.caseTag}>{item.tag}</span>
                <h3 className={styles.caseTitle}>{item.title}</h3>
                <p className={styles.caseDescription}>{item.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
