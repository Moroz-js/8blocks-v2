'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { digitalAssetsContent } from '@/shared/content/digitalAssets'
import { SectionHead } from './SectionHead'
import styles from './DigitalAssets.module.scss'

const ease = 'easeOut' as const
const { paths } = digitalAssetsContent

export function DigitalAssetsPaths() {
  return (
    <section className={styles.section} id="paths" aria-label={paths.label}>
      <div className={styles.inner}>
        <SectionHead
          label={paths.label}
          headline={paths.headline}
          description={paths.description}
        />

        <div className={styles.pathsGrid}>
          {paths.items.map((item, i) => (
            <motion.article
              key={i}
              className={styles.pathCard}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <div className={styles.pathImageWrap}>
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className={styles.pathImage}
                />
              </div>
              <div className={styles.pathOwn}>
                <span className={styles.pathRowLabel}>{paths.youOwnLabel}</span>
                <h3 className={styles.pathTitle}>{item.own}</h3>
                <p className={styles.pathResult}>→ {item.result}</p>
              </div>
              <dl className={styles.pathRows}>
                <div className={styles.pathRow}>
                  <dt className={styles.pathRowLabel}>{paths.holdersGetLabel}</dt>
                  <dd className={styles.pathRowValue}>{item.holdersGet}</dd>
                </div>
                <div className={styles.pathRow}>
                  <dt className={styles.pathRowLabel}>{paths.youKeepLabel}</dt>
                  <dd className={styles.pathRowValue}>{item.youKeep}</dd>
                </div>
                <div className={styles.pathRow}>
                  <dt className={styles.pathRowLabel}>{paths.firstWeCheckLabel}</dt>
                  <dd className={styles.pathRowValue}>{item.firstWeCheck}</dd>
                </div>
              </dl>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
