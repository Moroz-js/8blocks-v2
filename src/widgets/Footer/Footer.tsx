import Link from 'next/link'
import Image from 'next/image'
import { socialLinks } from '@/shared/config/site'
import { NewsletterForm } from '@/features/newsletter'
import { t } from '@/shared/i18n'
import { Logo } from '@/shared/ui'
import { FooterWatermark } from './FooterWatermark'
import styles from './Footer.module.scss'

const pageLinks = [
  { label: t({ ru: 'Услуги', en: 'Services' }), href: '/services' },
  { label: t({ ru: 'Блог', en: 'Blog' }), href: '/blog' },
  { label: t({ ru: 'Контакты', en: 'Contact' }), href: '/contact' },
]

const serviceLinks = [
  { label: t({ ru: 'Стратегический консалтинг', en: 'Strategic consulting' }), href: '/services/strategic-consulting' },
  { label: t({ ru: 'Базовая токеномика', en: 'Basic tokenomics' }), href: '/services/tokenomics' },
  { label: t({ ru: 'Аудит токеномики', en: 'Tokenomics audit' }), href: '/services/audit' },
]

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
              <p className={styles.subscribeLabel}>{t({ ru: 'Подписаться', en: 'Subscribe' })}</p>
              <NewsletterForm />
              <p className={styles.subscribeNote}>{t({ ru: 'Подписка для тех, кто хочет разбираться глубже.', en: 'A newsletter for those who want to go deeper.' })}</p>
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
              <p className={styles.navHeading}>{t({ ru: 'Навигация', en: 'Navigation' })}</p>
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
              <p className={styles.navHeading}>{t({ ru: 'Услуги', en: 'Services' })}</p>
              <ul className={styles.navList}>
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.navLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Moscow office map */}
            <div className={styles.mapCol}>
              <div className={styles.mapWrap} data-lenis-prevent>
                <iframe
                  title={t({ ru: 'Карта', en: 'Map' })}
                  src={t({
                    ru: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2246.4!2d37.6082!3d55.7271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54bca36edce63%3A0x5b0e4d43e4f5d2a0!2z0JvQtdC90LjQvdGB0LrQuNC5INC_0YDQvtGB0L_QtdC60YIsIDE10LAsINCc0L7RgdC60LLQsA!5e0!3m2!1sru!2sru',
                    en: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.5!2d55.1404!3d25.0757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6cbcaf4a3271%3A0x6b0e8c5f4f1b1b1b!2sUptown+Tower%2C+DMCC+Business+Centre%2C+Dubai!5e0!3m2!1sen!2sae',
                  })}
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
              © {new Date().getFullYear()} 8BLOCKS FZCO. {t({ ru: 'Все права защищены.', en: 'All rights reserved.' })}
            </p>
            <Link href="/privacy-policy" className={styles.privacyLink}>
              {t({ ru: 'Политика конфиденциальности', en: 'Privacy Policy' })}
            </Link>
          </div>
        </div>
      </div>

    </footer>
  )
}
