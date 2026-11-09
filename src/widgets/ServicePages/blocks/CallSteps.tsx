import Image from 'next/image'
import clsx from 'clsx'
import { Button, Section, StepNumber } from '@/shared/ds'
import callZoom from '../assets/call-zoom.webp'
import styles from './CallSteps.module.scss'

interface CallStepsProps {
  title: string
  imageAlt: string
  steps: readonly { title: string; description: string }[]
  action: { label: string; href: string }
  /** Screenshot above the title (readiness result) instead of under it (calculator result). */
  imageFirst?: boolean
}

/** «45 minutes with the team»: call screenshot, three numbered steps and a button. */
export function CallSteps({ title, imageAlt, steps, action, imageFirst = false }: CallStepsProps) {
  return (
    <Section>
      <div className={clsx(styles.call, imageFirst && styles.imageFirst)}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.image}>
          <Image src={callZoom} alt={imageAlt} fill sizes="(max-width: 640px) 100vw, 596px" />
        </div>
        <ol className={styles.steps}>
          {steps.map((step, i) => (
            <li key={step.title} className={styles.step}>
              <StepNumber>{i + 1}</StepNumber>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.muted}>{step.description}</p>
            </li>
          ))}
        </ol>
        <Button href={action.href} className={styles.action}>
          {action.label}
        </Button>
      </div>
    </Section>
  )
}
