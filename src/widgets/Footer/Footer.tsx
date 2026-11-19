import Link from 'next/link'
import { socialLinks, siteConfig } from '@/shared/config/site'
import type { SiteNav } from '@/shared/content/siteNav'
import { NewsletterForm } from '@/features/newsletter'
import { filterNav, type NavFlags } from '@/widgets/Header/navFilter'
import { SocialIcon } from './SocialIcon'
import styles from './Footer.module.scss'

interface FooterProps extends NavFlags {
  nav: SiteNav
}

export function Footer({ nav: fullNav, ...flags }: FooterProps) {
  const nav = filterNav(fullNav, flags)
  const { footer } = nav

  return (
    <footer data-chrome="footer" className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <p className={styles.subscribe}>{footer.subscribe}</p>
            <p className={styles.note}>{footer.subscribeNote}</p>
            <div className={styles.form}>
              <NewsletterForm text={footer.newsletter} />
            </div>
            <div className={styles.socials}>
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className={styles.social}
                  aria-label={link.label}
                  title={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon id={link.id} />
                </a>
              ))}
            </div>
          </div>

          <div className={styles.columns}>
            {nav.groups.map((group) => (
              <nav key={group.id} className={styles.column} aria-label={group.label}>
                <p className={styles.heading}>{group.label}</p>
                {group.columns
                  .flatMap((column) => column.links)
                  .map((link) => (
                    <Link key={link.href} href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  ))}
              </nav>
            ))}
          </div>

          <div className={styles.office}>
            <p className={styles.heading}>{footer.office}</p>
            <div className={styles.map} data-lenis-prevent>
              <iframe
                title={footer.mapTitle}
                src={footer.mapEmbedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a href={`mailto:${siteConfig.email}`} className={styles.link}>
              {siteConfig.email}
            </a>
            <a href={`tel:${siteConfig.phone.replace(/[^\d+]/g, '')}`} className={styles.link}>
              {siteConfig.phone}
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. {footer.rights}
          </p>
          <div className={styles.legal}>
            {footer.legal.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
