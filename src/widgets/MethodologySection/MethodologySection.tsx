'use client'

import { Fragment } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeftRight,
  CircleCheck,
  DollarSign,
  Lock,
  ShieldCheck,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { methodologyContent } from '@/shared/content/homePage'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import styles from './MethodologySection.module.scss'

const PRODUCT_BARS = [34, 48, 60, 78, 100]
const TOKEN_BARS = [38, 52, 66, 82, 100]

const SIGNAL_ICONS: Record<string, LucideIcon> = {
  'value-capture': DollarSign,
  'token-necessity': CircleCheck,
  'demand-elasticity': TrendingUp,
  'supply-sinks': Trophy,
  'on-chain-proof': ShieldCheck,
  'rule-durability': Lock,
}

function Headline() {
  return (
    <h2 className={styles.headline}>
      {methodologyContent.headlineSegments.map((seg, i) => {
        const lines = seg.text.split('\n')
        const node = lines.map((line, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {line}
          </Fragment>
        ))
        return 'accent' in seg && seg.accent ? (
          <span key={i} className={styles.accent}>
            {node}
          </span>
        ) : (
          <Fragment key={i}>{node}</Fragment>
        )
      })}
    </h2>
  )
}

function BarChart({ bars, accent }: { bars: number[]; accent?: boolean }) {
  return (
    <div className={styles.bars} aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className={accent ? styles.barAccent : styles.bar}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )
}

export function MethodologySection() {
  const { product, token, linkage, marquee, signals, footnote, faq } = methodologyContent
  const marqueeLoop = [...marquee, ...marquee]

  return (
    <section className={styles.section} aria-label={methodologyContent.ariaLabel}>
      <div className={styles.inner}>
        {/* ── Header ───────────────────────────────────────────── */}
        <motion.span
          className={styles.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className={styles.labelBracket}>[</span>
          {methodologyContent.label}
          <span className={styles.labelBracket}>]</span>
        </motion.span>

        <Headline />

        {/* ── Equation: Product ↔ Token ────────────────────────── */}
        <div className={styles.equation}>
          <span className={styles.tokenNote}>{token.topNote}</span>

          <div className={styles.equationGrid}>
            {/* Product card */}
            <div className={styles.panel}>
              <span className={styles.panelLabel}>{product.label}</span>
              <BarChart bars={PRODUCT_BARS} />
              <span className={styles.panelCaption}>{product.caption}</span>
            </div>

            {/* Linkage node */}
            <div className={styles.linkage}>
              <span className={styles.linkageBadge}>
                <ArrowLeftRight size={18} aria-hidden="true" />
              </span>
              <span className={styles.linkageLabel}>{linkage.title}</span>
            </div>

            {/* Token card */}
            <div className={`${styles.panel} ${styles.panelToken}`}>
              <span className={`${styles.panelLabel} ${styles.panelLabelAccent}`}>
                {token.label}
              </span>
              <BarChart bars={TOKEN_BARS} accent />
              <span className={styles.panelCaption}>{token.caption}</span>
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────── */}
        <p className={styles.body}>
          <strong className={styles.bodyLead}>{methodologyContent.bodyLead}</strong>
          {methodologyContent.bodyRest}
        </p>

        {/* ── Marquee ──────────────────────────────────────────── */}
        <div className={styles.marquee} aria-hidden="true">
          <div className={styles.marqueeTrack}>
            {marqueeLoop.map((item, i) => (
              <span key={i} className={styles.marqueeItem}>
                {item}
                <span className={styles.marqueeDot}>·</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Signals grid ─────────────────────────────────────── */}
        <ul className={styles.signals}>
          {signals.map((signal) => {
            const Icon = SIGNAL_ICONS[signal.id] ?? CircleCheck
            return (
              <li key={signal.id} className={styles.signal}>
                <span className={styles.signalIcon}>
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className={styles.signalTitle}>{signal.title}</h3>
                <p className={styles.signalLine}>{signal.line}</p>
              </li>
            )
          })}
        </ul>

        {/* ── Footnote ─────────────────────────────────────────── */}
        <p className={styles.footnote}>{footnote}</p>

        {/* ── FAQ (no heading) ─────────────────────────────────── */}
        {faq.length > 0 && (
          <div className={styles.faq}>
            <FaqAccordion items={faq} bare />
          </div>
        )}
      </div>
    </section>
  )
}
