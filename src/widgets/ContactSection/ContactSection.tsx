import { siteConfig } from '@/shared/config/site'
import { ContactForm } from '@/features/contactForm'
import styles from './ContactSection.module.scss'

export function ContactSection() {
  return (
    <section className={styles.section} aria-labelledby="contact-heading">
      <div className={styles.inner}>
        <div className={styles.formGrid}>
          <div className={styles.formMeta}>
            <span className={styles.formLabel}>
              <span className={styles.labelBracket}>[</span>
              Контакт
              <span className={styles.labelBracket}>]</span>
            </span>
            <h1 id="contact-heading" className={styles.formHeadline}>
              Обсудим<br />
              <span className={styles.formHeadlineAccent}>ваш проект</span>
            </h1>
            <p className={styles.formDescription}>
              Расскажите нам о своей задаче — мы ответим в течение одного рабочего дня и предложим
              формат сотрудничества.
            </p>
            <a href={`mailto:${siteConfig.email}`} className={styles.directEmail}>
              {siteConfig.email}
            </a>
          </div>
          <div className={styles.formWrap}>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
