import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/shared/ui'
import { servicesContent } from '@/shared/content/homePage'
import styles from './services-index.module.scss'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Strategic consulting, tokenomics design, and tokenomics audit. We help design and fix token economies for Web3 projects.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services | 8Blocks',
    description: 'Strategic consulting, tokenomics design, and tokenomics audit.',
    url: '/services',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services | 8Blocks',
    description: 'Strategic consulting, tokenomics design, and tokenomics audit.',
  },
}

const SERVICE_TIMING: Record<string, string> = {
  'strategic-consulting': '2–4 months',
  tokenomics: '3–7 weeks',
  audit: 'From 2 weeks',
}

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <Container>
        <header className={styles.header}>
          <span className={styles.label}>
            <span className={styles.labelBracket}>[</span>
            {servicesContent.label}
            <span className={styles.labelBracket}>]</span>
          </span>
          <h1 className={styles.headline}>
            {servicesContent.headline.replace('\n', ' ')}
          </h1>
          <p className={styles.description}>
            We help projects turn tokens into working economic instruments — from strategy and
            tokenomics design to audit of existing models.
          </p>
        </header>

        <div className={styles.grid}>
          {servicesContent.items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.card} ${styles[`accent-${item.accentColor}`]}`}
            >
              <div className={styles.cardTopBorder} aria-hidden="true" />
              <span className={styles.cardBadge}>{SERVICE_TIMING[item.id] ?? ''}</span>
              <h2 className={styles.cardTitle}>{item.title}</h2>
              <p className={styles.cardDescription}>{item.description}</p>
              <span className={styles.cardLink}>
                Learn more <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  )
}
