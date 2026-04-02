import { siteConfig } from '@/shared/config/site'
import { contactPageContent } from '@/shared/content/contactPage'
import { ContactForm } from '@/features/contactForm'
import styles from './ContactSection.module.scss'

export function ContactSection() {
  return (
    <section className={styles.section} aria-labelledby="contact-heading">
      <div className={styles.inner}>
        <div className={styles.infoBlock}>
          <div className={styles.leftCol}>
            <span className={styles.formLabel}>
              <span className={styles.labelBracket}>[</span>
              {contactPageContent.section.label}
              <span className={styles.labelBracket}>]</span>
            </span>
            <h1 id="contact-heading" className={styles.formHeadline}>
              {contactPageContent.section.headline}<br />
              <span className={styles.formHeadlineAccent}>{contactPageContent.section.headlineAccent}</span>
            </h1>
            <p className={styles.formDescription}>
              {contactPageContent.section.description}
            </p>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3 7.5h18v9H3v-9Z" stroke="currentColor" strokeWidth="1.7" />
                    <path d="m4 8.5 8 6 8-6" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                </span>
                <div>
                  <p className={styles.contactTitle}>{contactPageContent.section.emailLabel}</p>
                  <a href={`mailto:${siteConfig.email}`} className={styles.contactLink}>
                    {siteConfig.email}
                  </a>
                </div>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8.2 3.8a1.5 1.5 0 0 1 2.1-.1l1.9 1.7a1.5 1.5 0 0 1 .2 2.1l-1 1.4a1.5 1.5 0 0 0 .1 1.9l2.7 2.7a1.5 1.5 0 0 0 1.9.1l1.4-1a1.5 1.5 0 0 1 2.1.2l1.7 1.9a1.5 1.5 0 0 1-.1 2.1l-1.5 1.5a3 3 0 0 1-3 .7c-2.6-.7-5.2-2.4-7.5-4.7S4 10.9 3.3 8.3a3 3 0 0 1 .7-3l1.5-1.5Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                  </svg>
                </span>
                <div>
                  <p className={styles.contactTitle}>{contactPageContent.section.phoneLabel}</p>
                  <a href={`tel:${siteConfig.phone.replace(/[^\d+]/g, '')}`} className={styles.contactLink}>
                    {siteConfig.phone}
                  </a>
                </div>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21s6-5.7 6-10.5A6 6 0 1 0 6 10.5C6 15.3 12 21 12 21Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <circle cx="12" cy="10.5" r="2.2" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                </span>
                <div>
                  <p className={styles.contactTitle}>{contactPageContent.section.officeLabel}</p>
                  <p className={styles.contactText}>{siteConfig.address}</p>
                  <a
                    href={siteConfig.addressUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.contactLink}
                  >
                    {contactPageContent.section.directionsLabel}
                  </a>
                </div>
              </li>
            </ul>
          </div>
          <div className={styles.formWrap}>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
