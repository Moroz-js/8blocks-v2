import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { headers } from 'next/headers'
import { Suspense, type ReactNode } from 'react'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { ScrollToTop } from '@/shared/ui/ScrollToTop'
import { siteConfig } from '@/shared/config/site'
import { siteNav } from '@/shared/content/siteNav'
import { htmlLang, locale, lang } from '@/shared/i18n'
import { LenisProvider } from '@/shared/lib/LenisProvider'
import { GTMScript } from '@/shared/lib/GTMScript'
import { PlatformAnalyticsProvider } from '@/shared/lib/PlatformAnalyticsProvider'
import { SiteEventTracker } from '@/shared/lib/SiteEventTracker'
import { ThemeProvider } from '@/shared/lib/ThemeProvider'
import { ThemeController } from '@/shared/lib/ThemeController'
import { MantineThemeBridge } from '@/shared/lib/MantineThemeBridge'
import { ReplainWidget } from '@/shared/lib/ReplainWidget'
import { HeadMarkupInjector } from '@/widgets/HeadMarkupInjector'
import { getBlogExtraHeadMarkup, getSiteSeoGlobal, getSiteSeoPageOverride } from '@/shared/lib/site-seo'
import { organizationNode, websiteNode } from '@/shared/lib/content-schema'
import { getMediaMentionsEnabled } from '@/shared/lib/getMediaMentionsCount'
import { getBlogEnabled } from '@/shared/lib/getBlogEnabled'
import { getPublicAuditsEnabled } from '@/shared/lib/getPublicAuditsEnabled'
import { getResearchEnabled } from '@/shared/lib/getResearchEnabled'
import { getEventsEnabled } from '@/shared/lib/getEventsEnabled'

/*
 * Shared <html>/<body> shell for every site root layout.
 *
 * The site has two root layouts — (site) on the current design system and
 * (site-v2) on the new one. Each imports its own global stylesheet and renders
 * this shell, so SEO, analytics, chat, header, footer and section flags stay in
 * one place. Header and footer adapt to the page's system via the chrome
 * contract (docs/styleguide.md → «Хедер и футер»).
 */

// Локальные файлы вместо next/font/google: сборка не зависит от доступности Google Fonts.
// next/font/local берёт имя семейства из имени константы, поэтому она называется Manrope —
// на это имя ссылаются стили ($font-base, SVG).
const Manrope = localFont({
  src: [
    { path: '../fonts/Manrope-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Manrope-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Manrope-800.woff2', weight: '800', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-manrope',
})

const isStaging = process.env.NEXT_PUBLIC_STAGING === 'true'

export const siteMetadata: Metadata = {
  title: {
    default: `${siteConfig.brandShort} — ${siteConfig.description}`,
    template: `%s | ${siteConfig.brandShort}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  icons: lang === 'ru'
    ? {
        icon: [{ url: '/icons/favicon-ru.svg', type: 'image/svg+xml' }],
        shortcut: '/icons/favicon-ru.svg',
        apple: '/icons/favicon-ru.svg',
      }
    : {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
      },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [siteConfig.ogImage],
  },
  robots: isStaging
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      }
    : undefined,
}

const siteEntityJsonLd = { '@context': 'https://schema.org', '@graph': [organizationNode(), websiteNode()] }

interface SiteShellProps {
  children: ReactNode
  /** Design system of the pages under this root layout; exposed as html[data-ds]. */
  system: 'v1' | 'v2'
  /** Fixed top blur strip under the header (current system only). */
  topBlur?: boolean
}

export async function SiteShell({ children, system, topBlur = false }: SiteShellProps) {
  const pathname = (await headers()).get('x-pathname') ?? '/'
  const [siteSeo, pageRow, blogExtra, mediaEnabled, auditsEnabled, blogNavEnabled, researchEnabled, eventsEnabled] = await Promise.all([
    getSiteSeoGlobal(),
    getSiteSeoPageOverride(pathname),
    getBlogExtraHeadMarkup(pathname),
    getMediaMentionsEnabled(),
    getPublicAuditsEnabled(),
    getBlogEnabled(),
    getResearchEnabled(),
    getEventsEnabled(),
  ])

  const headCombined = [siteSeo?.globalHeadMarkup, pageRow?.pageHeadMarkup, blogExtra]
    .map((s) => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean)
    .join('\n')

  return (
    <html lang={htmlLang} className={Manrope.variable} data-ds={system} suppressHydrationWarning>
      <head>
        {/* Site-wide entities: every page graph links to #organization / #website by @id. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteEntityJsonLd) }}
        />
        {headCombined ? <HeadMarkupInjector markup={headCombined} /> : null}
      </head>
      <body suppressHydrationWarning>
        {topBlur ? (
          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: 120,
              pointerEvents: 'none',
              zIndex: 99,
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
            }}
          />
        ) : null}
        <ThemeProvider>
          <ThemeController />
          <MantineThemeBridge>
            <GTMScript />
            <Suspense fallback={null}>
              <PlatformAnalyticsProvider />
              <SiteEventTracker />
            </Suspense>
            {process.env.NEXT_PUBLIC_REPLAIN_ID && (
              <ReplainWidget id={process.env.NEXT_PUBLIC_REPLAIN_ID} />
            )}
            <LenisProvider>
              <Header
                nav={siteNav}
                mediaEnabled={mediaEnabled}
                auditsEnabled={auditsEnabled}
                blogEnabled={blogNavEnabled}
                researchEnabled={researchEnabled}
                eventsEnabled={eventsEnabled}
                digitalAssetsEnabled={siteConfig.digitalAssetsEnabled}
              />
              <main>{children}</main>
              <Footer
                nav={siteNav}
                mediaEnabled={mediaEnabled}
                auditsEnabled={auditsEnabled}
                blogEnabled={blogNavEnabled}
                researchEnabled={researchEnabled}
                eventsEnabled={eventsEnabled}
                digitalAssetsEnabled={siteConfig.digitalAssetsEnabled}
              />
              <ScrollToTop />
            </LenisProvider>
          </MantineThemeBridge>
        </ThemeProvider>
      </body>
    </html>
  )
}
