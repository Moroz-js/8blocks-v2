'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navGroups } from '@/shared/config/site'
import { t } from '@/shared/i18n'
import { uiStrings } from '@/shared/content/uiStrings'
import { Button, Logo } from '@/shared/ui'
import { ThemeToggle } from '@/shared/ui/ThemeToggle'
import { useThemeScopeActive } from '@/shared/lib/ThemeScope'
import styles from './Header.module.scss'

const soonLabel = t({ ru: 'скоро', en: 'soon' })

interface HeaderProps {
  mediaEnabled?: boolean
  blogEnabled?: boolean
  researchEnabled?: boolean
}

export function Header({
  mediaEnabled: _mediaEnabled,
  blogEnabled = false,
  researchEnabled = false,
}: HeaderProps) {
  const groups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          (item.href !== '/blog' || blogEnabled) &&
          (item.href !== '/research' || researchEnabled),
      ),
    }))
    .filter((group) => group.items.length > 0)

  const [isOpen, setIsOpen] = useState(false)
  const [overHero, setOverHero] = useState(false)
  const pathname = usePathname()
  const showThemeToggle = useThemeScopeActive()

  // Close menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close mobile menu when navigating
    setIsOpen(false)
  }, [pathname])

  // Transparent header with light text while overlapping a dark audit hero.
  useEffect(() => {
    const update = () => {
      const hero = document.querySelector('[data-audit-hero]')
      if (!hero) {
        setOverHero(false)
        return
      }
      const headerH = window.innerWidth <= 640 ? 56 : 64
      setOverHero(hero.getBoundingClientRect().bottom > headerH)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [pathname])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <header className={`${styles.header} ${overHero ? styles.overHero : ''}`}>
        <div className={styles.inner}>
          <Logo className={styles.logo} />

          <nav className={styles.nav} aria-label="Main navigation">
            <ul className={styles.navList}>
              {groups.map((group) => (
                <li key={group.label} className={styles.navGroup}>
                  <button type="button" className={styles.navLink} aria-haspopup="true">
                    {group.label}
                    <span className={styles.navChevron} aria-hidden="true">▾</span>
                  </button>
                  <div className={styles.dropdown}>
                    <ul className={styles.dropdownList}>
                      {group.items.map((item) =>
                        item.soon ? (
                          <li key={item.label}>
                            <span className={styles.dropdownSoon}>
                              {item.label}
                              <span className={styles.soonBadge}>{soonLabel}</span>
                            </span>
                          </li>
                        ) : (
                          <li key={item.href}>
                            <Link href={item.href} className={styles.dropdownLink}>
                              {item.label}
                            </Link>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            {showThemeToggle && <ThemeToggle />}
            <Link href="/contact" className={styles.ctaLink}>
              <Button variant="primary" size="sm" type="button">
                {uiStrings.contactUs}
              </Button>
            </Link>
          </div>

          <div className={styles.mobileHeaderActions}>
            {showThemeToggle && <ThemeToggle />}
            <button
              className={`${styles.burger} ${isOpen ? styles.burgerOpen : ''}`}
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? uiStrings.menuClose : uiStrings.menuOpen}
              aria-expanded={isOpen}
            >
              <span className={styles.burgerLabel}>
                {isOpen ? uiStrings.menuCloseLabel : uiStrings.menuLabel}
              </span>
              <span className={styles.burgerLines} aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!isOpen}
      >
        <nav aria-label="Mobile navigation">
          <div className={styles.mobileNavGroups}>
            {groups.map((group, gi) => (
              <div
                key={group.label}
                className={styles.mobileNavGroup}
                style={{ '--i': gi } as React.CSSProperties}
              >
                <p className={styles.mobileNavGroupLabel}>{group.label}</p>
                <ul className={styles.mobileNavList}>
                  {group.items.map((item) =>
                    item.soon ? (
                      <li key={item.label}>
                        <span className={`${styles.mobileNavLink} ${styles.mobileNavSoon}`}>
                          {item.label}
                          <span className={styles.soonBadge}>{soonLabel}</span>
                        </span>
                      </li>
                    ) : (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={styles.mobileNavLink}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.mobileActions}>
            <Link
              href="/contact"
              className={styles.mobileCta}
              onClick={() => setIsOpen(false)}
            >
              <Button variant="primary" size="lg" fullWidth type="button">
                {uiStrings.contactUs}
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}
