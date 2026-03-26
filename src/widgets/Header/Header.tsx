'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navLinks } from '@/shared/config/site'
import { t } from '@/shared/i18n'
import { Button, Logo } from '@/shared/ui'
import styles from './Header.module.scss'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close mobile menu when navigating
    setIsOpen(false)
  }, [pathname])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Logo className={styles.logo} />

          <nav className={styles.nav} aria-label="Main navigation">
            <ul className={styles.navList}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.navLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <Link href="/contact" className={styles.ctaLink}>
              <Button variant="primary" size="sm" type="button">
                {t({ ru: 'Связаться с нами', en: 'Contact us' })}
              </Button>
            </Link>
          </div>

          <button
            className={`${styles.burger} ${isOpen ? styles.burgerOpen : ''}`}
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? t({ ru: 'Закрыть меню', en: 'Close menu' }) : t({ ru: 'Открыть меню', en: 'Open menu' })}
            aria-expanded={isOpen}
          >
            <span className={styles.burgerLabel}>
              {isOpen ? t({ ru: 'Закрыть', en: 'Close' }) : t({ ru: 'Меню', en: 'Menu' })}
            </span>
            <span className={styles.burgerLines} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!isOpen}
      >
        <nav aria-label="Mobile navigation">
          <ul className={styles.mobileNavList}>
            {navLinks.map((link, i) => (
              <li key={link.href} style={{ '--i': i } as React.CSSProperties}>
                <Link
                  href={link.href}
                  className={styles.mobileNavLink}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={styles.mobileNavIndex}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.mobileActions}>
            <Link
              href="/contact"
              className={styles.mobileCta}
              onClick={() => setIsOpen(false)}
            >
              <Button variant="primary" size="lg" fullWidth type="button">
                {t({ ru: 'Связаться с нами', en: 'Contact us' })}
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}
