'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import styles from './ProblemBlock.module.scss'
import {
  IconRouteFork,
  IconBrokenSignal,
  IconDisconnectedNodes,
  IconFragmentedChecklist,
  IconTiltedScale,
  IconBrokenGrowth,
  IconObscuredShield,
  IconRadarPing,
  IconDisconnectedTokenProduct,
  IconFadingPulse,
  IconOpenVault,
  IconHollowToken,
} from './ProblemBlockIcons'

const ease = 'easeOut' as const

export interface ProblemItem {
  title: string
  description: string
}

export type ProblemBlockVariant = 'consulting' | 'audit' | 'tokenomics'

interface ProblemBlockProps {
  variant: ProblemBlockVariant
  headline: string
  description?: string
  items: readonly ProblemItem[]
  cta?: {
    headline: string
    ctaLabel: string
    ctaHref: string
  }
}

type IconComponent = React.FC

const iconsByVariant: Record<ProblemBlockVariant, IconComponent[]> = {
  consulting: [IconRouteFork, IconBrokenSignal, IconDisconnectedNodes, IconFragmentedChecklist],
  audit: [IconTiltedScale, IconBrokenGrowth, IconObscuredShield, IconRadarPing],
  tokenomics: [IconDisconnectedTokenProduct, IconFadingPulse, IconOpenVault, IconHollowToken],
}

const gridClassByVariant: Record<ProblemBlockVariant, string> = {
  consulting: styles.gridConsulting,
  audit: styles.gridAudit,
  tokenomics: styles.gridTokenomics,
}

export function ProblemBlock({ variant, headline, description, items, cta }: ProblemBlockProps) {
  const icons = iconsByVariant[variant]
  const gridClass = gridClassByVariant[variant]

  return (
    <section className={styles.section} aria-label="Problem">
      <div className={styles.inner}>
        <div className={styles.header}>
          <ScrollRevealText text={headline} className={styles.headline} />
          {description && (
            <ScrollRevealText text={description} className={styles.description} />
          )}
        </div>

        <div className={gridClass}>
          {items.map((item, i) => {
            const Icon = icons[i]
            return (
              <motion.article
                key={i}
                className={styles.card}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDescription}>{item.description}</p>
                </div>
                <div className={styles.cardIcon}>
                  <Icon />
                </div>
              </motion.article>
            )
          })}
        </div>

        {cta && (
          <motion.div
            className={styles.ctaRow}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, ease, delay: items.length * 0.08 }}
          >
            <p className={styles.ctaHeadline}>{cta.headline}</p>
            <Link href={cta.ctaHref} className={styles.ctaBtn}>
              {cta.ctaLabel}
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
