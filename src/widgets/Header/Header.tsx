'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import type { SiteNav } from '@/shared/content/siteNav'
import { AccentSurface } from '@/shared/ds'
import { Logo } from '@/shared/ui'
import { ThemeToggle } from '@/shared/ui/ThemeToggle'
import { useThemeScopeActive } from '@/shared/lib/ThemeScope'
import { BinaryGlyph } from '@/widgets/BinaryArt/BinaryGlyph'
import { StagingBar } from './StagingBar'
import { filterNav, type NavFlags } from './navFilter'
import coinArt from './assets/nav-ill-tokenomics-coin.png'
import houseArt from './assets/nav-ill-assets-house.png'
import profilesArt from './assets/nav-ill-company-profiles.png'
import styles from './Header.module.scss'

const isStaging = process.env.NEXT_PUBLIC_STAGING === 'true'

/** Intro card art per menu, placed as in the mockup (420×220 card). */
const INTRO_ART: Record<string, { src: StaticImageData; className: string }> = {
  tokenomics: { src: coinArt, className: styles.artCoin },
  assets: { src: houseArt, className: styles.artHouse },
  company: { src: profilesArt, className: styles.artProfiles },
}

/** Menus without a drawn card art use an engine glyph; it mounts only while the menu is open. */
const INTRO_GLYPH: Record<string, string> = {
  media: 'docpage',
}

interface HeaderProps extends NavFlags {
  nav: SiteNav
  className?: string
}

function Chevron() {
  return (
    <svg className={styles.chevron} width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Header({ nav: fullNav, className, ...flags }: HeaderProps) {
  const nav = filterNav(fullNav, flags)
  const [openId, setOpenId] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const switchTimer = useRef<number | undefined>(undefined)
  const pathname = usePathname()

  // With a menu open, switching waits a moment: a diagonal path to the panel can
  // cross a neighbouring trigger without swapping the menu.
  const hoverGroup = (id: string) => {
    window.clearTimeout(switchTimer.current)
    if (!openId || openId === id) setOpenId(id)
    else switchTimer.current = window.setTimeout(() => setOpenId(id), 150)
  }

  const closeMenu = () => {
    window.clearTimeout(switchTimer.current)
    setOpenId(null)
  }

  useEffect(() => () => window.clearTimeout(switchTimer.current), [])
  const showThemeToggle = useThemeScopeActive()

  // Close menus after client-side navigation.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset menus when the route changes
    setOpenId(null)
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!openId && !mobileOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpenId(null)
      setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openId, mobileOpen])

  return (
    <>
      {isStaging && <StagingBar />}
      <header
        data-chrome="header"
        className={clsx(styles.header, isStaging && styles.headerStaging, openId && styles.menuOpen, className)}
        // The header row sits above the open panel, so leaving is tracked on the whole header.
        onMouseLeave={closeMenu}
      >
        <div className={styles.inner}>
          <Logo className={styles.logo} />

          <nav
            ref={navRef}
            className={styles.nav}
            aria-label="Main navigation"
            onBlur={(event) => {
              if (!navRef.current?.contains(event.relatedTarget)) closeMenu()
            }}
          >
            <span className={styles.sheet} aria-hidden="true" />
            {nav.groups.map((group) => {
              const open = openId === group.id
              const art = INTRO_ART[group.id]
              return (
                <div
                  key={group.id}
                  className={clsx(styles.item, open && styles.itemOpen)}
                  onMouseEnter={() => hoverGroup(group.id)}
                  onFocus={() => setOpenId(group.id)}
                >
                  <button
                    type="button"
                    className={styles.trigger}
                    aria-expanded={open}
                    aria-controls={`nav-panel-${group.id}`}
                    onClick={() => setOpenId(open ? null : group.id)}
                  >
                    {group.label}
                    <Chevron />
                  </button>
                  <div id={`nav-panel-${group.id}`} className={styles.panel}>
                    <Link href={group.intro.href} className={styles.intro} onClick={() => setOpenId(null)}>
                      <AccentSurface />
                      {art && <Image src={art.src} alt="" className={clsx(styles.introArt, art.className)} />}
                      {open && INTRO_GLYPH[group.id] && (
                        <span className={styles.introGlyph} aria-hidden="true">
                          <BinaryGlyph shape={INTRO_GLYPH[group.id]} os={0.8} />
                        </span>
                      )}
                      <span className={styles.introText}>
                        <span className={styles.introTitle}>{group.intro.title}</span>
                        <span className={styles.introLead}>{group.intro.text}</span>
                      </span>
                      <span className={styles.introMore}>{group.intro.more}</span>
                    </Link>
                    {group.columns.map((column) => (
                      <div key={column.heading} className={styles.column}>
                        <p className={styles.columnHeading}>{column.heading}</p>
                        {column.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={styles.link}
                            onClick={() => setOpenId(null)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </nav>

          <div className={styles.actions}>
            {showThemeToggle && <ThemeToggle />}
            <Link href={nav.contact.href} className={styles.contact}>
              {nav.contact.label}
            </Link>
            <button
              type="button"
              className={clsx(styles.burger, mobileOpen && styles.burgerOpen)}
              onClick={() => setMobileOpen((value) => !value)}
              aria-label={mobileOpen ? nav.menu.close : nav.menu.open}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span className={styles.burgerLabel}>{mobileOpen ? nav.menu.closeLabel : nav.menu.label}</span>
              <span className={styles.burgerLines} aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        data-chrome="mobile-menu"
        className={clsx(styles.mobileMenu, isStaging && styles.mobileMenuStaging, mobileOpen && styles.mobileMenuOpen)}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
      >
        <nav className={styles.mobileNav} aria-label="Mobile navigation" data-lenis-prevent>
          {nav.groups.map((group, index) => (
            <div key={group.id} className={styles.mobileGroup} style={{ '--i': index } as CSSProperties}>
              <p className={styles.mobileGroupLabel}>{group.label}</p>
              {group.columns.map((column) => (
                <div key={column.heading} className={styles.mobileColumn}>
                  <p className={styles.columnHeading}>{column.heading}</p>
                  {column.links.map((link) => (
                    <Link key={link.href} href={link.href} className={styles.mobileLink}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <Link href={nav.contact.href} className={styles.mobileContact}>
            {nav.contact.label}
          </Link>
        </nav>
      </div>
    </>
  )
}
