import Link from 'next/link'
import Image from 'next/image'
import { socialLinks } from '@/shared/config/site'
import { NewsletterForm } from '@/features/newsletter'
import { Logo } from '@/shared/ui'
import { FooterWatermark } from './FooterWatermark'
import styles from './Footer.module.scss'

const pageLinks = [
  { label: 'Услуги', href: '/services' },
  { label: 'Блог', href: '/blog' },
  { label: 'Контакты', href: '/contact' },
]

const serviceLinks = [
  { label: 'Стратегический консалтинг', href: '/services/strategic-consulting' },
  { label: 'Базовая токеномика', href: '/services/tokenomics' },
  { label: 'Аудит токеномики', href: '/services/audit' },
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
              <p className={styles.subscribeLabel}>Подписаться</p>
              <NewsletterForm />
              <p className={styles.subscribeNote}>Подписка для тех, кто хочет разбираться глубже.</p>
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
              <p className={styles.navHeading}>Навигация</p>
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
              <p className={styles.navHeading}>Услуги</p>
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
              <div className={styles.mapWrap} data-lenis-prevent>
                <iframe
                  title="Карта"
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
              © {new Date().getFullYear()} 8Blocks. Все права защищены.
            </p>
            <Link href="/privacy-policy" className={styles.privacyLink}>
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>

    </footer>
  )
}
