import type { ReactNode } from 'react'
import { Carousel, StepNumber } from '@/shared/ds'
import styles from './StepsCarousel.module.scss'

interface StepsCarouselProps {
  title: ReactNode
  steps: readonly { title: ReactNode; description: ReactNode }[]
  labels: { prev: string; next: string }
  numbering?: 'plain' | 'padded'
}

/** «How we work»: numbered steps in a horizontal carousel. */
export function StepsCarousel({ title, steps, labels, numbering = 'plain' }: StepsCarouselProps) {
  return (
    <Carousel title={title} sheen={false} slideWidth={386} labels={labels}>
      {steps.map((step, i) => (
        <div key={i} className={styles.step}>
          <StepNumber>{numbering === 'padded' ? String(i + 1).padStart(2, '0') : i + 1}</StepNumber>
          <div className={styles.text}>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.description}>{step.description}</p>
          </div>
        </div>
      ))}
    </Carousel>
  )
}
