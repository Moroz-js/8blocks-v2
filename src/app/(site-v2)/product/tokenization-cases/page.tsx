import type { Metadata } from 'next'
import { platformPagesContent } from '@/shared/content/platformPages'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { buildPageGraph, itemListNode } from '@/shared/lib/page-schema'
import { lang } from '@/shared/i18n'
import enCases from '@/shared/lib/platform/cases/content.json'
import ruCases from '@/shared/lib/platform/cases/content.ru.json'
import { TokenizationCasesPage as CasesLibraryPage } from '@/widgets/TokenizationCases/TokenizationCasesPage'
import type { CasesData } from '@/widgets/TokenizationCases/CasesLibrary'

const copy = platformPagesContent.cases

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/product/tokenization-cases', {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `${siteConfig.url.replace(/\/$/, '')}/product/tokenization-cases`,
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: '/product/tokenization-cases',
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: [siteConfig.ogImage],
    },
  })
}

export default function TokenizationCasesPage() {
  const path = '/product/tokenization-cases'
  // CasesLibrary — клиентский компонент: передаём только текущую локаль.
  const data = (lang === 'ru' ? ruCases : enCases) as CasesData
  const jsonLd = buildPageGraph({
    path,
    name: copy.title,
    description: copy.description,
    pageType: 'CollectionPage',
    crumbs: [{ name: copy.title, path }],
    extra: [
      itemListNode(
        path,
        copy.title,
        data.cases.map((c) => ({
          name: c.name,
          description: c.line ?? null,
          datePublished: c.year ?? null,
          citation: c.source ?? null,
        })),
      ),
    ],
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CasesLibraryPage copy={copy} data={data} />
    </>
  )
}
