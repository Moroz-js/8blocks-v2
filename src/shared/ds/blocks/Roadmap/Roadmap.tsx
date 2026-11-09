import type { ReactNode } from 'react'
import clsx from 'clsx'
import { StepNumber } from '../../ui/Elements'
import styles from './Roadmap.module.scss'

export interface RoadmapStep {
  title: ReactNode
  description: ReactNode
}

interface RoadmapProps {
  steps: readonly RoadmapStep[]
  /** Steps per row on desktop. */
  columns?: 3 | 4
  /** Step marker: `1` or zero-padded `01`. */
  numbering?: 'plain' | 'padded'
  className?: string
}

/** Figma: «Кейс» / Roadmap (45:2055) — numbered steps, 3 per row. */
export function Roadmap({ steps, columns = 3, numbering = 'plain', className }: RoadmapProps) {
  return (
    <ol className={clsx(styles.list, columns === 4 && styles.cols4, className)}>
      {steps.map((step, i) => (
        <li key={i} className={styles.step}>
          <StepNumber>{numbering === 'padded' ? String(i + 1).padStart(2, '0') : i + 1}</StepNumber>
          <div className={styles.text}>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.description}>{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
