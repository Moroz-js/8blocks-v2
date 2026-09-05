import type { Metadata } from 'next'
import Link from 'next/link'
import { platformPagesContent } from '@/shared/content/platformPages'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { buildPageGraph, itemListNode } from '@/shared/lib/page-schema'
import { lang } from '@/shared/i18n'
import enCases from '@/shared/lib/platform/cases/content.json'
import ruCases from '@/shared/lib/platform/cases/content.ru.json'
import { CasesShowcase } from '@/widgets/Platform/CasesShowcase'
import styles from '@/widgets/Platform/Platform.module.scss'

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
  const data = (lang === 'ru' ? ruCases : enCases) as {
    cases: { name: string; line?: string; year?: string; source?: { title: string; url: string } }[]
  }
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

  const logos = [
    'blackrock',
    'jpmorgan',
    'visa',
    'mastercard',
    'hsbc',
    'robinhood',
  ]

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroCentered}`}>
          <div className={styles.badges}>
            {copy.badges.map((badge) => (
              <span key={badge} className={styles.badge}>
                {badge}
              </span>
            ))}
          </div>
          <h1 className={styles.headline}>{copy.headline}</h1>
          <p className={styles.lead}>{copy.lead}</p>
          <div className={styles.logoStrip}>
            {logos.map((logo) => (
              // Curated local brand assets.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={logo}
                className={styles.orgLogo}
                src={`/logos/orgs/${logo}.svg`}
                alt=""
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <CasesShowcase />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <span className={styles.label}>{copy.scaleLabel}</span>
          <p className={styles.sectionLead}>{copy.scaleText}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.container} ${styles.ctaBand}`}>
          <h2 className={styles.sectionTitle}>{copy.ctaTitle}</h2>
          <div className={styles.ctaBandActions}>
            <Link
              href="/product/tokenization-readiness"
              className={styles.primary}
            >
              {copy.readiness} →
            </Link>
            <Link href="/contact" className={styles.secondary}>
              {copy.contact}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
