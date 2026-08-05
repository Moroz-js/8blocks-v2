import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import '@mantine/core/styles.css'
import '../globals.scss'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { ScrollToTop } from '@/shared/ui/ScrollToTop'
import { siteConfig } from '@/shared/config/site'
import { htmlLang, locale, lang } from '@/shared/i18n'
import { LenisProvider } from '@/shared/lib/LenisProvider'
import { GTMScript } from '@/shared/lib/GTMScript'
import { PlatformAnalyticsProvider } from '@/shared/lib/PlatformAnalyticsProvider'
import { ThemeProvider } from '@/shared/lib/ThemeProvider'
import { ThemeController } from '@/shared/lib/ThemeController'
import { MantineThemeBridge } from '@/shared/lib/MantineThemeBridge'
import { ReplainWidget } from '@/shared/lib/ReplainWidget'
import { HeadMarkupInjector } from '@/widgets/HeadMarkupInjector'
import { getBlogExtraHeadMarkup, getSiteSeoGlobal, getSiteSeoPageOverride } from '@/shared/lib/site-seo'
import { getMediaMentionsEnabled } from '@/shared/lib/getMediaMentionsCount'
import { getBlogEnabled } from '@/shared/lib/getBlogEnabled'
import { getPublicAuditsEnabled } from '@/shared/lib/getPublicAuditsEnabled'
import { getResearchEnabled } from '@/shared/lib/getResearchEnabled'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '800'],
  display: 'swap',
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.description}`,
    template: `%s | ${siteConfig.name}`,
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
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get('x-pathname') ?? '/'
  const [siteSeo, pageRow, blogExtra, mediaEnabled, auditsEnabled, blogNavEnabled, researchEnabled] = await Promise.all([
    getSiteSeoGlobal(),
    getSiteSeoPageOverride(pathname),
    getBlogExtraHeadMarkup(pathname),
    getMediaMentionsEnabled(),
    getPublicAuditsEnabled(),
    getBlogEnabled(),
    getResearchEnabled(),
  ])

  const headCombined = [siteSeo?.globalHeadMarkup, pageRow?.pageHeadMarkup, blogExtra]
    .map((s) => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean)
    .join('\n')

  return (
    <html lang={htmlLang} className={manrope.variable} suppressHydrationWarning>
      <head>{headCombined ? <HeadMarkupInjector markup={headCombined} /> : null}</head>
      <body suppressHydrationWarning>
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
        <ThemeProvider>
          <ThemeController />
          <MantineThemeBridge>
            <GTMScript />
            <Suspense fallback={null}>
              <PlatformAnalyticsProvider />
            </Suspense>
            {process.env.NEXT_PUBLIC_REPLAIN_ID && (
              <ReplainWidget id={process.env.NEXT_PUBLIC_REPLAIN_ID} />
            )}
            <LenisProvider>
              <Header
                mediaEnabled={mediaEnabled}
                blogEnabled={blogNavEnabled}
                researchEnabled={researchEnabled}
              />
              <main>{children}</main>
              <Footer
                mediaEnabled={mediaEnabled}
                auditsEnabled={auditsEnabled}
                blogEnabled={blogNavEnabled}
                researchEnabled={researchEnabled}
              />
              <ScrollToTop />
            </LenisProvider>
          </MantineThemeBridge>
        </ThemeProvider>
      </body>
    </html>
  )
}
