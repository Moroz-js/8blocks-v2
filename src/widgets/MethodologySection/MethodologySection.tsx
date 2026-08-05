'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CircleDollarSign,
  Flame,
  Link2,
  Plug,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { methodologyContent } from '@/shared/content/auditsPage'
import styles from './MethodologySection.module.scss'

const SIGNAL_ICONS: Record<string, LucideIcon> = {
  'value-capture': CircleDollarSign,
  'token-necessity': Plug,
  'demand-elasticity': TrendingUp,
  'supply-sinks': Flame,
  'on-chain-proof': Link2,
  'rule-durability': ShieldCheck,
}

type LinkageMode = 'strong' | 'none'

function GearScene({ mode }: { mode: LinkageMode }) {
  const isStrong = mode === 'strong'
  const description = isStrong
    ? methodologyContent.strongDescription
    : methodologyContent.noLinkageDescription

  return (
    <div className={styles.gears}>
      <div
        className={styles.gearsStage}
        data-linkage={mode}
        aria-label={description}
      >
        <div className={`${styles.gear} ${styles.gearProduct}`}>
          <Image
            src="/img/huge-uniform.png"
            alt=""
            width={759}
            height={748}
            className={styles.gearImage}
            priority
          />
          <div className={styles.gearLabel}>
            <strong>{methodologyContent.product.label}</strong>
            <span>{methodologyContent.product.caption}</span>
          </div>
        </div>

        <div className={`${styles.gear} ${styles.gearTpl}`}>
          <Image
            src="/img/tiny-uniform.png"
            alt=""
            width={655}
            height={632}
            className={styles.gearImage}
            priority
          />
          <div className={styles.gearLabel}>
            <strong>{methodologyContent.linkage.label}</strong>
            <span>{methodologyContent.linkage.caption}</span>
          </div>
        </div>

        <div className={`${styles.gear} ${styles.gearToken}`}>
          <Image
            src="/img/huge-uniform.png"
            alt=""
            width={759}
            height={748}
            className={styles.gearImage}
          />
          <div className={styles.gearLabel}>
            <strong>{methodologyContent.token.label}</strong>
            <span>{methodologyContent.token.caption}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MethodologySection() {
  const [linkageMode, setLinkageMode] = useState<LinkageMode>('strong')

  return (
    <section id="methodology" className={styles.section} aria-label={methodologyContent.ariaLabel}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>
            <span aria-hidden="true">[</span>
            {methodologyContent.label}
            <span aria-hidden="true">]</span>
          </span>
          <h2 className={styles.headline}>{methodologyContent.headline}</h2>
        </div>

        <GearScene mode={linkageMode} />

        <div className={styles.linkageControl}>
          <span
            className={styles.linkageOption}
            data-active={linkageMode === 'strong'}
          >
            {methodologyContent.strong}
          </span>
          <button
            type="button"
            role="switch"
            className={styles.linkageToggle}
            aria-label={methodologyContent.linkage.caption}
            aria-checked={linkageMode === 'none'}
            onClick={() =>
              setLinkageMode((mode) => (mode === 'strong' ? 'none' : 'strong'))
            }
          >
            <span className={styles.linkageToggleThumb} />
          </button>
          <span
            className={styles.linkageOption}
            data-active={linkageMode === 'none'}
          >
            {methodologyContent.noLinkage}
          </span>
        </div>

        <p className={styles.linkageDescription}>
          {linkageMode === 'strong'
            ? methodologyContent.strongDescription
            : methodologyContent.noLinkageDescription}
        </p>

        <ul className={styles.signals}>
          {methodologyContent.signals.map((signal) => {
            const Icon = SIGNAL_ICONS[signal.id] ?? CircleDollarSign

            return (
              <li key={signal.id} className={styles.signal} tabIndex={0}>
                <Icon className={styles.signalIcon} size={22} strokeWidth={1.7} aria-hidden="true" />
                <h3 className={styles.signalTitle}>{signal.title}</h3>
                <p className={styles.signalLine}>{signal.line}</p>
              </li>
            )
          })}
        </ul>

        <div className={styles.summary}>
          <p className={styles.ratingDescription}>{methodologyContent.ratingDescription}</p>
          <p className={styles.scoredNote}>{methodologyContent.scoredNote}</p>
          <p className={styles.transparency}>{methodologyContent.transparency}</p>
          <Link href="/contact" className={styles.consultationLink}>
            {methodologyContent.consultationLabel}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
