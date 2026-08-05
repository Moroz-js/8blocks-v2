import { Container } from '@/shared/ui'
import { ownersGuideContent } from '@/shared/content/ownersGuide'
import styles from './OwnersGuide.module.scss'

export function OwnersGuide() {
  return (
    <Container size="narrow">
      <article className={styles.article}>
        <header className={styles.header}>
          <p className={styles.label}>{ownersGuideContent.label}</p>
          <h1>{ownersGuideContent.title}</h1>
          <p className={styles.intro}>{ownersGuideContent.intro}</p>
        </header>

        <ol className={styles.questions}>
          {ownersGuideContent.questions.map(([question, answer], index) => (
            <li key={question}>
              <span className={styles.number}>{index + 1}</span>
              <div>
                <h2>{question}</h2>
                <p>{answer}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.cta}>
          <p>{ownersGuideContent.cta}</p>
          <a href="https://calendly.com/care-8blocks/intro" target="_blank" rel="noopener noreferrer">
            {ownersGuideContent.ctaLabel} →
          </a>
        </div>

        <p className={styles.disclaimer}>{ownersGuideContent.disclaimer}</p>
      </article>
    </Container>
  )
}
