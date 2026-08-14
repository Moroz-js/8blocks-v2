import type { Metadata } from 'next'
import { diagnosticContent } from '@/shared/lib/platform/diagnostic/content'
import { platformPagesContent } from '@/shared/content/platformPages'
import { siteConfig } from '@/shared/config/site'
import { t } from '@/shared/i18n'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { DiagnosticTool } from '@/widgets/Platform/DiagnosticTool'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import styles from '@/widgets/Platform/Platform.module.scss'

const landing = diagnosticContent.landing
const copy = platformPagesContent.readiness
const previewPillars = [
  { score: 7, max: 8, level: 'strong' as const },
  { score: 4, max: 8, level: 'moderate' as const },
  { score: 5, max: 8, level: 'moderate' as const },
  { score: 3, max: 8, level: 'weak' as const },
]
const levelLabels = {
  strong: t({ ru: 'сильный', en: 'strong' }),
  moderate: t({ ru: 'средний', en: 'moderate' }),
  weak: t({ ru: 'слабый', en: 'weak' }),
}
const levelClasses = {
  strong: styles.pillarStrong,
  moderate: styles.pillarModerate,
  weak: styles.pillarWeak,
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ a?: string }>
}): Promise<Metadata> {
  const { a } = await searchParams
  const ogImage = a ? `/api/og?a=${encodeURIComponent(a)}` : '/api/og'
  return withPayloadPageMetadata('/product/tokenization-readiness', {
    title: landing.seoTitle,
    description: landing.metaDescription,
    alternates: {
      canonical: `${siteConfig.url.replace(/\/$/, '')}/product/tokenization-readiness`,
    },
    openGraph: {
      title: landing.seoTitle,
      description: landing.metaDescription,
      url: '/product/tokenization-readiness',
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: landing.seoTitle,
      description: landing.metaDescription,
      images: [ogImage],
    },
  })
}

export default function TokenizationReadinessPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: landing.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <main className={`${styles.page} ${styles.readinessPage}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div>
            <div className={styles.badges}>
              {copy.badges.map((badge) => (
                <span key={badge} className={styles.badge}>
                  {badge}
                </span>
              ))}
            </div>
            <h1 className={styles.headline}>{landing.h1}</h1>
            <p className={styles.lead}>{copy.heroText}</p>
            <div className={styles.actions}>
              <a href="#assessment" className={styles.primary}>
                {copy.primary} →
              </a>
              <a
                href="?sample=asset-backed#assessment"
                className={styles.secondary}
              >
                {copy.sample}
              </a>
            </div>
            <p className={styles.heroPrivacy}>{copy.privacy}</p>
          </div>
          <div className={styles.resultHero}>
            <span className={styles.label}>{copy.verdictsLabel}</span>
            <h2 className={styles.resultTitle}>
              {diagnosticContent.verdicts[0].name}
            </h2>
            <p className={styles.description}>
              {diagnosticContent.verdicts[0].forWhom}
            </p>
            <div className={styles.previewPillars}>
              {copy.methodologyItems.map(([title], index) => {
                const pillar = previewPillars[index]
                return (
                  <div key={title}>
                    <div className={styles.spread}>
                      <span>{title}</span>
                      <span className={`${styles.mono} ${levelClasses[pillar.level]}`}>
                        {pillar.score}/{pillar.max} · {levelLabels[pillar.level]}
                      </span>
                    </div>
                    <div className={styles.bar}>
                      <div
                        className={`${styles.barFill} ${levelClasses[pillar.level]}`}
                        style={{ width: `${(pillar.score / pillar.max) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <span className={styles.label}>{copy.verdictsLabel}</span>
          <div className={styles.verdictGrid}>
            {diagnosticContent.verdicts.map((verdict, index) => (
              <a
                key={verdict.id}
                href="#assessment"
                className={`${styles.card} ${styles.verdictCard}`}
              >
                <span className={styles.mono}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.verdictName}>{verdict.name}</h3>
                <p className={styles.verdictDescription}>{verdict.forWhom}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="assessment" className={styles.section}>
        <div className={styles.narrow}>
          <div className={styles.sectionHeader}>
            <span className={styles.label}>{copy.assessmentLabel}</span>
          </div>
          <DiagnosticTool />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.narrow}>
          <span className={styles.label}>{copy.methodologyLabel}</span>
          <h2 className={styles.sectionTitle}>{copy.methodologyTitle}</h2>
          <div className={`${styles.fourGrid} ${styles.methodologyGrid}`}>
            {copy.methodologyItems.map(([title, description], index) => (
              <div key={title} className={styles.card}>
                <span className={styles.mono}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{title}</h3>
                <p className={styles.fine}>{description}</p>
              </div>
            ))}
          </div>
          <div className={styles.methodologyDetails}>
            <details className={styles.card}>
              <summary>{copy.fullMethodology} +</summary>
              <p className={styles.description}>{landing.methodology}</p>
            </details>
            <details className={styles.card}>
              <summary>{copy.definition} +</summary>
              <p className={styles.description}>{landing.definition}</p>
            </details>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.narrow}>
          <span className={styles.label}>{copy.faq}</span>
          <FaqAccordion
            bare
            items={landing.faq.map((item) => ({
              question: item.q,
              answer: item.a,
            }))}
          />
        </div>
      </section>
    </main>
  )
}
