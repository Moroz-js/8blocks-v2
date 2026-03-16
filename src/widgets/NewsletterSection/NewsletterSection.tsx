import { NewsletterForm } from '@/features/newsletter'
import styles from './NewsletterSection.module.scss'

export function NewsletterSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.meta}>
          <span className={styles.label}>
            <span className={styles.labelBracket}>[</span>
            Newsletter
            <span className={styles.labelBracket}>]</span>
          </span>
          <h2 className={styles.headline}>
            Token economics, delivered
          </h2>
          <p className={styles.description}>
            Insights on tokenomics design, Web3 economics, and token engineering — straight to your inbox. No noise, just substance.
          </p>
        </div>

        <div className={styles.formWrap}>
          <NewsletterForm />
          <p className={styles.note}>No spam. Unsubscribe any time.</p>
        </div>
      </div>
    </section>
  )
}
