import type { ReactNode } from 'react'
import clsx from 'clsx'
import { StepNumber } from '../../ui/Elements'
import styles from './Roadmap.module.scss'

export interface RoadmapStep {
  title: ReactNode
  description: ReactNode
}

/** Figma: «Кейс» / Roadmap (45:2055) — numbered steps, 3 per row. */
export function Roadmap({ steps, className }: { steps: readonly RoadmapStep[]; className?: string }) {
  return (
    <ol className={clsx(styles.list, className)}>
      {steps.map((step, i) => (
        <li key={i} className={styles.step}>
          <StepNumber>{i + 1}</StepNumber>
          <div className={styles.text}>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.description}>{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
