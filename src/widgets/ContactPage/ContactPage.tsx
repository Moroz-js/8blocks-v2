import Image from 'next/image'
import { Button, Section } from '@/shared/ds'
import { siteConfig, socialLinks } from '@/shared/config/site'
import { lang } from '@/shared/i18n'
import { contactFormContent, contactPageContent } from '@/shared/content/contactPage'
import { ContactForm } from '@/features/contactForm/ContactForm'
import { SocialIcon } from '@/widgets/Footer/SocialIcon'
import oxana from './assets/oxana.webp'
import styles from './ContactPage.module.scss'

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  'https://calendly.com/care-8blocks/intro?hide_gdpr_banner=1&background_color=101113&text_color=ffffff&primary_color=ca005a'

const { hero, calendly, contacts } = contactPageContent

/** Contact page on design system v2 (project 2 «Contact»). Calendly is EN-only, as before. */
export function ContactPage() {
  return (
    <>
      {lang === 'en' && (
        <section id="calendly" className={styles.booking} aria-label={calendly.ariaLabel}>
          <div className={styles.bookingIntro}>
            <h2 className={styles.bookingTitle}>{calendly.headline}</h2>
            <div className={styles.bookingText}>
              <p className={styles.services}>
                {calendly.services.map((service, i) => (
                  <span key={service} className={styles.service}>
                    {i > 0 && <span className={styles.dot} aria-hidden="true" />}
                    {service}
                  </span>
                ))}
              </p>
              <p className={styles.bookingDescription}>{calendly.description}</p>
            </div>
          </div>
          <div className={styles.calendly}>
            <iframe src={CALENDLY_URL} title={calendly.ariaLabel} loading="lazy" />
          </div>
        </section>
      )}

      <Section aria-label={hero.ariaLabel}>
        <div className={styles.contact}>
          <div className={styles.formColumn}>
            <div className={styles.formIntro}>
              <h1 className={styles.title}>{hero.headline}</h1>
              <p className={styles.faint}>{hero.description}</p>
            </div>
            <ContactForm text={contactFormContent} />
          </div>
          <div className={styles.person}>
            <Image src={oxana} alt={`${hero.person.name}, ${hero.person.role}`} className={styles.photo} sizes="247px" />
            <p className={styles.personName}>{hero.person.name}</p>
            <p className={styles.personRole}>{hero.person.role}</p>
            <div className={styles.personLinks}>
              <Button href={hero.person.tgHref} target="_blank" rel="noopener noreferrer">
                {hero.person.tgLabel}
              </Button>
              <Button variant="secondary" href={`mailto:${siteConfig.email}`}>
                {`${hero.person.emailLabel} ${siteConfig.email}`}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section aria-label={contacts.ariaLabel}>
        <dl className={styles.details}>
          <div className={styles.detail}>
            <dt className={styles.muted}>{contacts.addressLabel}</dt>
            <dd>
              <a href={siteConfig.addressUrl} target="_blank" rel="noopener noreferrer" className={styles.detailValue}>
                {siteConfig.address}
              </a>
            </dd>
          </div>
          <div className={styles.detail}>
            <dt className={styles.muted}>{contacts.phoneLabel}</dt>
            <dd>
              <a href={`tel:${siteConfig.phone.replace(/[^\d+]/g, '')}`} className={styles.detailValue}>
                {siteConfig.phone}
              </a>
            </dd>
          </div>
          <div className={styles.detail}>
            <dt className={styles.muted}>{contacts.socialsLabel}</dt>
            <dd className={styles.socials}>
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className={styles.social}
                >
                  <SocialIcon id={link.id} />
                </a>
              ))}
            </dd>
          </div>
        </dl>
      </Section>
    </>
  )
}
