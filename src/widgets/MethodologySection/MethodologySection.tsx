'use client'

import { Fragment, type ReactNode, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  CircleDollarSign,
  Flame,
  Link2,
  Plug,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { methodologyContent } from '@/shared/content/homePage'
import styles from './MethodologySection.module.scss'

const SIGNAL_ICONS: Record<string, LucideIcon> = {
  'value-capture': CircleDollarSign,
  'token-necessity': Plug,
  'demand-elasticity': TrendingUp,
  'supply-sinks': Flame,
  'on-chain-proof': Link2,
  'rule-durability': ShieldCheck,
}

const SIGNAL_TONES = [styles.toneA, styles.toneA, styles.toneB, styles.toneB, styles.toneC, styles.toneC]

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

function renderRichText(text: string): ReactNode {
  if (!text.includes('](')) return text

  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0
  for (const match of text.matchAll(LINK_RE)) {
    const index = match.index ?? 0
    if (index > lastIndex) nodes.push(text.slice(lastIndex, index))
    const [, label, href] = match
    nodes.push(
      <Link key={key++} href={href} className={styles.closingLink}>
        {label}
      </Link>,
    )
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
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

const ANIMATION_ENABLED = true
// Left spins alone this long before center/right join the same timeline.
// Must be a multiple of 2000/3 ms: in that time the big gear (18s / 27 teeth)
// and the center gear (8s / 12 teeth) rotate by a whole number of teeth, so
// snapping center/right forward by this amount produces no visible jump.
const MESH_ENGAGE_MS = 4000 / 3 // ≈1333ms = exactly 2 teeth on both gears

// Choreographed linkage:
//  0. left gear spins idle (alone)
//  1. center gear fades/scales in from the background
//  2. mesh engaged → center + right gears start spinning
type LinkagePhase = 'idle' | 'left' | 'engaged'

function GearsLinkage() {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<LinkagePhase>('idle')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout)
    }
  }, [])

  const start = () => {
    if (!ANIMATION_ENABLED) return
    if (phase !== 'idle') return
    if (reduceMotion) {
      setPhase('engaged')
      return
    }
    // Left spins alone for MESH_ENGAGE_MS (a whole number of teeth), then
    // center/right start their own animations from the matching static pose.
    setPhase('left')
    timers.current.push(setTimeout(() => setPhase('engaged'), MESH_ENGAGE_MS))
  }

  const staticPreview = !ANIMATION_ENABLED
  const spinning = ANIMATION_ENABLED && !reduceMotion && phase !== 'idle'
  const meshEngaged = phase === 'engaged'
  const centerVisible = staticPreview || reduceMotion || meshEngaged
  const meshSpinning = ANIMATION_ENABLED && !reduceMotion && meshEngaged

  return (
    <div className={styles.gears} aria-hidden="true">
      <motion.div
        className={styles.gearsStage}
        data-phase={phase}
        onViewportEnter={start}
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className={`${styles.gearHuge} ${styles.gearLeft}`}>
          <div
            className={spinning ? styles.spinLeftCw : styles.spinLeftOffset}
          >
            <Image
              src="/img/huge-uniform.png"
              alt=""
              width={759}
              height={748}
              className={styles.gearImg}
              priority
            />
          </div>
        </div>

        <div
          className={`${styles.gearTiny} ${centerVisible ? styles.gearTinyIn : ''}`}
        >
          <div className={meshSpinning ? styles.spinInnerCcw : ''}>
            <Image
              src="/img/tiny-uniform.png"
              alt=""
              width={655}
              height={632}
              className={styles.gearImg}
              priority
            />
          </div>
        </div>

        <div className={`${styles.gearHuge} ${styles.gearRight}`}>
          <div
            className={meshSpinning ? styles.spinRightCw : styles.spinRightOffset}
          >
            <Image
              src="/img/huge-uniform.png"
              alt=""
              width={759}
              height={748}
              className={styles.gearImg}
            />
          </div>
        </div>

        <span className={styles.gearsLabel}>
          <span>Token</span>
          <span>Product Linkage</span>
        </span>
      </motion.div>
    </div>
  )
}

export function MethodologySection() {
  const { signals, closingLead, closingParagraphs } = methodologyContent

  return (
    <section
      id="methodology"
      className={styles.section}
      aria-label={methodologyContent.ariaLabel}
    >
      <div className={styles.inner}>
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

        <GearsLinkage />

        <p className={styles.body}>
          <strong className={styles.bodyLead}>{methodologyContent.bodyLead}</strong>
          {methodologyContent.bodyRest}
        </p>

        <div className={styles.detail}>
          <ul className={styles.signals}>
            {signals.map((signal, i) => {
              const Icon = SIGNAL_ICONS[signal.id] ?? CircleDollarSign
              const featured = i === 0

              return (
                <li
                  key={signal.id}
                  className={featured ? `${styles.signal} ${styles.signalFeatured}` : styles.signal}
                >
                  <span
                    className={`${styles.signalIcon} ${SIGNAL_TONES[i]}`}
                    aria-hidden="true"
                  >
                    <Icon size={22} strokeWidth={1.75} />
                  </span>
                  <div className={styles.signalCopy}>
                    <h3 className={styles.signalTitle}>{signal.title}</h3>
                    <p className={styles.signalLine}>{signal.line}</p>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className={styles.closing}>
            <p className={styles.closingLead}>{closingLead}</p>
            {closingParagraphs.map((paragraph, i) => (
              <p key={i} className={styles.closingParagraph}>
                {renderRichText(paragraph)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
