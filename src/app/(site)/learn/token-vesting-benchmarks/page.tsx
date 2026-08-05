import type { Metadata } from 'next'
import Link from 'next/link'
import { lang, t } from '@/shared/i18n'
import enContent from '@/shared/lib/platform/benchmarks/content.json'
import ruContent from '@/shared/lib/platform/benchmarks/content.ru.json'
import enAudits from '@/shared/lib/platform/benchmarks/audits.json'
import ruAudits from '@/shared/lib/platform/benchmarks/audits.ru.json'
import { platformPagesContent } from '@/shared/content/platformPages'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { BenchmarkExplorer } from '@/widgets/Platform/BenchmarkExplorer'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import styles from '@/widgets/Platform/Platform.module.scss'

interface Source {
  title: string
  url: string
}

const content = lang === 'ru' ? ruContent : enContent
const audits = lang === 'ru' ? ruAudits : enAudits
const copy = platformPagesContent.benchmarks

const faq = t({
  en: [
    {
      q: 'What is the standard team vesting schedule?',
      a: 'A four-year schedule with a one-year cliff remains the most common reference. Roughly 25% vests at the cliff; project-specific terms vary.',
    },
    {
      q: 'How much token supply usually goes to the team?',
      a: 'Typical team allocations run 15–25% of supply, with common practice around 17.5–20% in the cited datasets.',
    },
    {
      q: 'What TGE unlock is considered normal?',
      a: 'Team: 0% at TGE. Seed investors: 0–5%; private rounds: 0–10%. Larger early unlocks increase sell-pressure risk.',
    },
    {
      q: 'Do token unlocks affect price?',
      a: 'Keyrock’s study of 16,000+ unlock events found roughly 90% were followed by price declines, with pressure often beginning before the unlock.',
    },
  ],
  ru: [
    {
      q: 'Какой график вестинга команды считается стандартным?',
      a: 'Чаще всего ориентируются на четыре года с клиффом один год. Около 25% разблокируется в конце клиффа, но условия зависят от проекта.',
    },
    {
      q: 'Какую долю предложения обычно получает команда?',
      a: 'В приведённых исследованиях типичный диапазон составляет 15–25%, а распространённое значение — около 17,5–20%.',
    },
    {
      q: 'Какая разблокировка на TGE считается нормальной?',
      a: 'Для команды — 0%, для seed-инвесторов — 0–5%, для private-раундов — 0–10%. Большая ранняя разблокировка повышает риск давления продаж.',
    },
    {
      q: 'Влияют ли разблокировки токенов на цену?',
      a: 'Исследование Keyrock более 16 000 событий показало снижение цены примерно после 90% разблокировок; давление часто начинается заранее.',
    },
  ],
})

function SourceLinks({ sources }: { sources: (Source | undefined)[] }) {
  return (
    <span className={styles.fine}>
      {sources.filter(Boolean).map((source, index) => (
        <span key={source?.url}>
          {index > 0 && ' · '}
          <a
            href={source?.url}
            rel="nofollow noopener noreferrer"
            target="_blank"
            className={styles.source}
          >
            {source?.title}
          </a>
        </span>
      ))}
    </span>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/learn/token-vesting-benchmarks', {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `${siteConfig.url.replace(/\/$/, '')}/learn/token-vesting-benchmarks`,
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: '/learn/token-vesting-benchmarks',
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

export default function TokenVestingBenchmarksPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className={styles.hero}>
        <div className={styles.narrow}>
          <div className={styles.badges}>
            {copy.badges.map((badge) => (
              <span key={badge} className={styles.badge}>
                {badge}
              </span>
            ))}
          </div>
          <h1 className={styles.headline}>{copy.headline}</h1>
          <p className={styles.lead}>{copy.lead}</p>
          <div className={styles.benchmarkLogoRow}>
            {['SOL', 'UNI', 'ARB', 'OP', 'HYPE', 'SUI', 'APT'].map(
              (symbol) => (
                // Curated local assets.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={symbol}
                  className={styles.logo}
                  src={`/logos/tokens/${symbol}.${
                    ['ARB', 'HYPE'].includes(symbol) ? 'jpg' : 'png'
                  }`}
                  alt=""
                  aria-hidden="true"
                />
              ),
            )}
            <span className={styles.fine}>{copy.projectsCount}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.narrow}>
          <div className={styles.sectionHeader}>
            <span className={styles.label}>{copy.categoryLabel}</span>
            <p className={styles.sectionLead}>{copy.categoryLead}</p>
          </div>
          <BenchmarkExplorer />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.narrow}>
          <div className={styles.spread}>
            <span className={styles.label}>{copy.audited}</span>
            <Link href="/audits" className={styles.source}>
              {copy.publicAudits} →
            </Link>
          </div>
          <div className={styles.auditGrid}>
            {audits.projects.map((audit) => (
              <Link
                key={audit.symbol}
                href={audit.url || '/audits'}
                className={`${styles.card} ${styles.auditCard}`}
              >
                <span className={styles.mono}>{audit.symbol}</span>
                <h3>{audit.name}</h3>
                <p className={styles.fine}>{audit.sector}</p>
                <p className={styles.description}>{audit.facts[0]}</p>
                <span className={styles.source}>{copy.readAudit} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.narrow}>
          <span className={styles.label}>{copy.allocationLabel}</span>
          <div className={styles.resultStack}>
            {content.buckets.map((bucket) => (
              <article key={bucket.key} className={styles.card}>
                <div className={styles.benchmarkHeader}>
                  <h2>{bucket.label}</h2>
                  <span className={styles.rangeValue}>
                    {bucket.typicalRange}
                  </span>
                </div>
                {!bucket.median.startsWith('n/a') && (
                  <p className={styles.fine}>median · {bucket.median}</p>
                )}
                <details>
                  <summary>{copy.contextSources} +</summary>
                  <p className={styles.description}>{bucket.note}</p>
                  <SourceLinks sources={[bucket.source, bucket.source2]} />
                </details>
              </article>
            ))}
          </div>
          <div className={`${styles.card} ${styles.spread}`}>
            <p>{copy.calculatorText}</p>
            <Link href="/product/calculator" className={styles.primary}>
              {copy.calculator} →
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.narrow}>
          <span className={styles.label}>{copy.vestingLabel}</span>
          <div className={styles.resultStack}>
            {content.vestingNorms.map((norm) => (
              <article key={norm.figure} className={styles.card}>
                <h3>{norm.figure}</h3>
                <p className={styles.description}>{norm.claim}</p>
                <SourceLinks sources={[norm.source, norm.source2]} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.narrow}>
          <span className={styles.label}>{copy.trendsLabel}</span>
          <div className={styles.resultStack}>
            {content.trends.map((trend) => (
              <article key={trend.source.url} className={styles.card}>
                <p className={styles.description}>{trend.claim}</p>
                <SourceLinks sources={[trend.source, trend.source2]} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.narrow}>
          <span className={styles.label}>{copy.faq}</span>
          <FaqAccordion
            bare
            items={faq.map((item) => ({
              question: item.q,
              answer: item.a,
            }))}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.narrow}>
          <span className={styles.label}>{copy.methodology}</span>
          <p className={styles.sectionLead}>{content.methodologyNote}</p>
        </div>
      </section>
    </main>
  )
}
