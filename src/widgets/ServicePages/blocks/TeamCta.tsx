import { Button, Section } from '@/shared/ds'
import styles from './TeamCta.module.scss'

interface TeamCtaProps {
  title: string
  description: string
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
  people: readonly { name: string; role: string; initials: string }[]
}

/** «We are trying to determine whether a real business case exists»: text, two buttons and the team. */
export function TeamCta({ title, description, primary, secondary, people }: TeamCtaProps) {
  return (
    <Section>
      <div className={styles.card}>
        <div className={styles.text}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.muted}>{description}</p>
        </div>
        <div className={styles.actions}>
          <Button href={primary.href}>{primary.label}</Button>
          <Button variant="secondary" href={secondary.href}>
            {secondary.label}
          </Button>
        </div>
        <ul className={styles.people}>
          {people.map((person) => (
            <li key={person.name} className={styles.person}>
              <span className={styles.avatar} aria-hidden="true">
                {person.initials}
              </span>
              <p className={styles.name}>{person.name}</p>
              <p className={styles.muted}>{person.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
