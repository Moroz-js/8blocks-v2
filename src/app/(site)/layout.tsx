import type { Metadata } from 'next'
import Script from 'next/script'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import '../globals.scss'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { siteConfig } from '@/shared/config/site'
import { LenisProvider } from '@/shared/lib/LenisProvider'
import { GTMScript } from '@/shared/lib/GTMScript'

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.description}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        {/* Top edge blur */}
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
        {/* Bottom edge blur — закомментировано
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: 44,
            pointerEvents: 'none',
            zIndex: 99,
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            maskImage: 'linear-gradient(to top, black 0%, black 40%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, black 40%, transparent 100%)',
          }}
        />
        */}
        <MantineProvider defaultColorScheme="dark">
          <GTMScript />
          <Script
            id="replain-settings"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.replainSettings = { id: '5cfc493a-e46f-4094-8448-6a22285c4399' };`,
            }}
          />
          <Script
            src="https://widget.replain.cc/dist/client.js"
            strategy="afterInteractive"
          />
          <LenisProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </LenisProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
