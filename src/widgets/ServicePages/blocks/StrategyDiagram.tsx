import type { ReactNode } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { Section } from '@/shared/ds'
import background from '../assets/sc-strategy-bg.webp'
import styles from './StrategyDiagram.module.scss'

interface StrategyDiagramProps {
  title: ReactNode
  description: ReactNode
  /** Six stages in reading order: top row left→right, bottom row right→left. */
  stages: readonly string[]
}

/** Text on the left, a looped six-stage route on a gradient card on the right. */
export function StrategyDiagram({ title, description, stages }: StrategyDiagramProps) {
  return (
    <Section>
      <div className={styles.layout}>
        <div className={styles.text}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.card}>
          <Image src={background} alt="" fill sizes="(max-width: 1024px) 100vw, 595px" className={styles.bg} />
          <svg className={styles.arrows} viewBox="0 0 595 525" aria-hidden="true">
            <defs>
              <marker id="strategy-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M1 1L9 5L1 9" />
              </marker>
            </defs>
            <path d="M197 180H220" />
            <path d="M374 180H398" />
            <path d="M552 180C578 180 578 345 552 345" />
            <path d="M398 345H374" />
            <path d="M220 345H197" />
          </svg>
          <ol className={styles.stages}>
            {stages.map((stage, i) => (
              <li key={i} className={clsx(styles.stage, i === stages.length - 1 && styles.final)}>
                <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.pill}>{stage}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}
