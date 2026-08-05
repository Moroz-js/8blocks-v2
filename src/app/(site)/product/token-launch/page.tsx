import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { tokenLaunchContent, tokenLaunchMeta } from '@/shared/content/tokenLaunch'
import {
  TokenLaunchHero,
  TokenLaunchGaps,
  TokenLaunchCosts,
  TokenLaunchPartners,
  TokenLaunchCalculator,
  TokenLaunchModuleSummary,
  TokenLaunchProcess,
  TokenLaunchFit,
  TokenLaunchFaq,
  TokenLaunchNetwork,
  TokenLaunchFinalCta,
} from '@/widgets/TokenLaunch'
import type { LaunchModuleView } from '@/widgets/TokenLaunch'
import { lang } from '@/shared/i18n'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/product/token-launch', {
    title: tokenLaunchMeta.title,
    description: tokenLaunchMeta.description,
    alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/product/token-launch` },
    openGraph: {
      title: tokenLaunchMeta.title,
      description: tokenLaunchMeta.description,
      url: '/product/token-launch',
    },
    twitter: {
      card: 'summary_large_image',
      title: tokenLaunchMeta.title,
      description: tokenLaunchMeta.description,
    },
  })
}

interface LaunchModuleDoc {
  id: number | string
  nameRu: string
  nameEn: string
  durationLabelRu: string
  durationLabelEn: string
  durationWeeks: number
  price: number
  priceFrom?: boolean | null
  parallel?: boolean | null
  includeInTotal?: boolean | null
  descriptionRu: string
  descriptionEn: string
  packages?:
    | {
        id?: string | null
        labelRu: string
        labelEn: string
        price: number
        durationWeeks?: number | null
      }[]
    | null
}

async function fetchLaunchModules(): Promise<LaunchModuleView[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'launch-modules',
      sort: 'order',
      limit: 100,
      depth: 0,
    })

    return (result.docs as unknown as LaunchModuleDoc[]).map((doc) => ({
      id: String(doc.id),
      name: lang === 'ru' ? doc.nameRu : doc.nameEn,
      durationLabel: lang === 'ru' ? doc.durationLabelRu : doc.durationLabelEn,
      durationWeeks: Number(doc.durationWeeks) || 0,
      parallel: Boolean(doc.parallel),
      price: Number(doc.price) || 0,
      priceFrom: Boolean(doc.priceFrom),
      includeInTotal: doc.includeInTotal !== false,
      description: lang === 'ru' ? doc.descriptionRu : doc.descriptionEn,
      packages: (doc.packages ?? []).map((pkg, index) => ({
        id: pkg.id ?? `pkg-${index}`,
        label: lang === 'ru' ? pkg.labelRu : pkg.labelEn,
        price: Number(pkg.price) || 0,
        durationWeeks: pkg.durationWeeks != null ? Number(pkg.durationWeeks) : null,
      })),
    }))
  } catch (error) {
    console.error('[token-launch] failed to load launch modules:', error)
    return []
  }
}

export default async function TokenLaunchPage() {
  const modules = await fetchLaunchModules()
  const siteUrl = siteConfig.url.replace(/\/$/, '')

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tokenLaunchContent.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: lang === 'ru' ? 'Запуск токена: один трек' : 'End-to-End Token Launch Track',
    serviceType:
      'Token launch services: tokenomics audit, tokenomics design, investor pitch preparation, crypto market making, token listing',
    description: tokenLaunchMeta.description,
    url: `${siteUrl}/product/token-launch`,
    provider: [
      { '@type': 'Organization', name: siteConfig.name, url: siteUrl },
      { '@type': 'Organization', name: 'Fibonacci Capital', url: 'https://fibonacci.market' },
      { '@type': 'Organization', name: 'BingX', url: 'https://bingx.com' },
    ],
    areaServed: ['US', 'Europe', 'MENA', 'LatAm'],
    ...(modules.length > 0 && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: lang === 'ru' ? 'Модули трека запуска токена' : 'Token launch track modules',
        itemListElement: modules.map((m) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: m.name,
            description: m.description,
          },
          price: m.price,
          priceCurrency: 'USD',
        })),
      },
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <TokenLaunchHero />
      <TokenLaunchGaps />
      <TokenLaunchCosts />
      <TokenLaunchPartners />
      <TokenLaunchCalculator modules={modules} />
      <TokenLaunchModuleSummary modules={modules} />
      <TokenLaunchProcess />
      <TokenLaunchFit />
      <TokenLaunchFaq />
      <TokenLaunchNetwork />
      <TokenLaunchFinalCta />
    </>
  )
}
