import Link from 'next/link'
import Image from 'next/image'
import { siteConfig, socialLinks } from '@/shared/config/site'
import { ContactForm } from '@/features/contactForm'
import { NewsletterForm } from '@/features/newsletter'
import { Logo } from '@/shared/ui'
import styles from './Footer.module.scss'

const pageLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
]

const serviceLinks = [
  { label: 'Strategic consulting', href: '/services/strategic-consulting' },
  { label: 'Basic tokenomics',     href: '/services/tokenomics' },
  { label: 'Tokenomics audit',     href: '/services/audit' },
]

export function Footer() {
  return (
    <footer className={styles.footer} id="contact">

      {/* ── Contact form ─────────────────────────────────────────── */}
      <div className={styles.formSection}>
        <div className={styles.inner}>
          <div className={styles.formGrid}>
            <div className={styles.formMeta}>
              <span className={styles.formLabel}>
                <span className={styles.labelBracket}>[</span>
                Contact
                <span className={styles.labelBracket}>]</span>
              </span>
              <h2 className={styles.formHeadline}>
                {"Let's discuss"}<br />
                <span className={styles.formHeadlineAccent}>your project</span>
              </h2>
              <p className={styles.formDescription}>
                Tell us about your challenge — we&apos;ll respond within one business day and propose a collaboration format.
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
      </div>

      {/* ── Brand watermark ──────────────────────────────────────── */}
      <div className={styles.watermarkSection} aria-hidden="true">
        <div className={styles.watermarkText}>8BLOCKS</div>
      </div>

      {/* ── Bottom section ───────────────────────────────────────── */}
      <div className={styles.bottomSection}>
        <div className={styles.inner}>
          <div className={styles.bottomGrid}>

            {/* Newsletter + socials */}
            <div className={styles.subscribeCol}>
              <p className={styles.subscribeLabel}>Subscribe</p>
              <NewsletterForm />
              <p className={styles.subscribeNote}>Go a level deeper on token economics.</p>
              <div className={styles.socials}>
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    className={styles.socialLink}
                    aria-label={link.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={link.icon}
                      alt=""
                      width={40}
                      height={40}
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Pages nav */}
            <nav aria-label="Pages">
              <p className={styles.navHeading}>Navigation</p>
              <ul className={styles.navList}>
                {pageLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.navLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Services nav */}
            <nav aria-label="Services">
              <p className={styles.navHeading}>Services</p>
              <ul className={styles.navList}>
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.navLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Dubai office map */}
            <div className={styles.mapCol}>
              {/* data-lenis-prevent stops Lenis from hijacking wheel events over the iframe */}
              <div className={styles.mapWrap} data-lenis-prevent>
                <iframe
                  title="8Blocks Dubai office"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231347.00243468955!2d55.05892653780744!3d25.04096525226673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6cade01aaaab%3A0x8d1c1334c0a3883d!2sDMCC%20I5%20Premium%20Business%20Centre!5e0!3m2!1sru!2sru!4v1770648759278!5m2!1sru!2sru"
                  className={styles.mapIframe}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

          </div>

          {/* Copyright bar */}
          <div className={styles.copyright}>
            <Logo className={styles.logo} />
            <p className={styles.copyrightText}>
              © {new Date().getFullYear()} 8Blocks. All rights reserved.
            </p>
            <Link href="/privacy-policy" className={styles.privacyLink}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

    </footer>
  )
}
