import type { Metadata } from 'next'
import Link from 'next/link'
import { platformPagesContent } from '@/shared/content/platformPages'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import {
  EarlyAccessCta,
  PipelineDemo,
} from '@/widgets/Platform/TokenomicsAiInteractive'
import styles from '@/widgets/Platform/Platform.module.scss'

const copy = platformPagesContent.ai

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/product/tokenomics-ai', {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `${siteConfig.url.replace(/\/$/, '')}/product/tokenomics-ai`,
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: '/product/tokenomics-ai',
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

function ComparisonCard({
  title,
  items,
  action,
}: {
  title: string
  items: string[]
  action: React.ReactNode
}) {
  return (
    <article className={styles.card}>
      <span className={styles.label}>{title}</span>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item} className={styles.listItem}>
            {item}
          </li>
        ))}
      </ul>
      <div className={styles.actions}>{action}</div>
    </article>
  )
}

export default function TokenomicsAiPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroCentered}`}>
          <div className={styles.badges}>
            {copy.badges.map((badge) => (
              <span key={badge} className={styles.badge}>
                {badge}
              </span>
            ))}
          </div>
          <h1 className={styles.headline}>
            {copy.headline}
            <br />
            <span className={styles.accent}>{copy.accent}</span>
          </h1>
          <p className={styles.lead}>{copy.lead}</p>
          <div className={styles.actions}>
            <EarlyAccessCta />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.label}>{copy.how}</span>
          </div>
          <PipelineDemo />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <span className={styles.label}>{copy.deliverablesLabel}</span>
          <div className={styles.cardGrid}>
            {copy.deliverables.map(([title, description], index) => (
              <article key={title} className={styles.card}>
                <span className={styles.mono}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{title}</h3>
                <p className={styles.description}>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <span className={styles.label}>{copy.compareLabel}</span>
          <div className={styles.pillarGrid}>
            <ComparisonCard
              title={copy.freeTitle}
              items={copy.freeItems}
              action={
                <Link href="/product/calculator" className={styles.secondary}>
                  {copy.calculator} →
                </Link>
              }
            />
            <ComparisonCard
              title={copy.sprintTitle}
              items={copy.sprintItems}
              action={<EarlyAccessCta label={copy.waitlist} />}
            />
          </div>
        </div>
      </section>

      <section id="early-access" className={styles.section}>
        <div className={`${styles.container} ${styles.ctaBand}`}>
          <div>
            <h2 className={styles.sectionTitle}>{copy.limited}</h2>
            <p className={styles.sectionLead}>{copy.limitedText}</p>
          </div>
          <div className={styles.ctaBandActions}>
            <EarlyAccessCta label={copy.waitlist} />
          </div>
        </div>
      </section>
    </main>
  )
}
