import Link from 'next/link'
import Image from 'next/image'
import { socialLinks } from '@/shared/config/site'
import { NewsletterForm } from '@/features/newsletter'
import { footerContent } from '@/shared/content/footer'
import { Logo } from '@/shared/ui'
import { FooterWatermark } from './FooterWatermark'
import styles from './Footer.module.scss'

export function Footer() {
  return (
    <footer className={styles.footer}>
      {/* ── Brand watermark ──────────────────────────────────────── */}
      <FooterWatermark />

      {/* ── Bottom section ───────────────────────────────────────── */}
      <div className={styles.bottomSection}>
        <div className={styles.inner}>
          <div className={styles.bottomGrid}>

            {/* Newsletter + socials */}
            <div className={styles.subscribeCol}>
              <p className={styles.subscribeLabel}>{footerContent.subscribeLabel}</p>
              <NewsletterForm />
              <p className={styles.subscribeNote}>{footerContent.subscribeNote}</p>
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
              <p className={styles.navHeading}>{footerContent.navHeading}</p>
              <ul className={styles.navList}>
                {footerContent.pageLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.navLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Services nav */}
            <nav aria-label="Services">
              <p className={styles.navHeading}>{footerContent.servicesHeading}</p>
              <ul className={styles.navList}>
                {footerContent.serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.navLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Map */}
            <div className={styles.mapCol}>
              <div className={styles.mapWrap} data-lenis-prevent>
                <iframe
                  title={footerContent.mapTitle}
                  src={footerContent.mapEmbedSrc}
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
              © {new Date().getFullYear()} 8BLOCKS FZCO. {footerContent.copyright}
            </p>
            <Link href="/privacy-policy" className={styles.privacyLink}>
              {footerContent.privacyPolicy}
            </Link>
          </div>
        </div>
      </div>

    </footer>
  )
}
