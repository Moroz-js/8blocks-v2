import { Button, Section } from '@/shared/ds'
import styles from './TeamCta.module.scss'

interface TeamCtaProps {
  title: string
  description: string
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
}

/** «We are trying to determine whether a real business case exists»: text left, two buttons right. */
export function TeamCta({ title, description, primary, secondary }: TeamCtaProps) {
  return (
    <Section>
      <div className={styles.card}>
        <div className={styles.text}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.muted}>{description}</p>
        </div>
        <div className={styles.actions}>
          <Button href={primary.href}>{primary.label}</Button>
          <Button variant="tertiary" href={secondary.href}>
            {secondary.label}
          </Button>
        </div>
      </div>
    </Section>
  )
}
