import Link from 'next/link'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import { methodologyContent as content } from '@/shared/content/methodology'
import { siteConfig, socialLinks } from '@/shared/config/site'
import { lang } from '@/shared/i18n'
import { MethodologyToc } from './MethodologyToc'
import styles from './MethodologyPage.module.scss'

function formatDate(value: string) {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00Z`))
}

function JsonLd({ value }: { value: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, '\\u003c') }}
    />
  )
}

export function MethodologyPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, '')
  const pageUrl = `${baseUrl}/${content.slug}`
  const organization = {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: siteConfig.name,
    url: baseUrl,
    foundingDate: '2017',
    sameAs: socialLinks.map((item) => item.href),
  }
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.title,
    description: content.metaDescription,
    url: pageUrl,
    inLanguage: lang,
    datePublished: content.publishedAt,
    dateModified: content.updatedAt,
    author: organization,
    publisher: organization,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
  const termSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: lang === 'en' ? '8Blocks tokenomics terms' : 'Термины методологии А8А9',
    url: pageUrl,
    hasDefinedTerm: [
      {
        '@type': 'DefinedTerm',
        name: lang === 'en' ? 'Token Economic Model' : 'Экономическая модель токена',
        description: content.definition[0],
      },
      {
        '@type': 'DefinedTerm',
        name: lang === 'en' ? 'Closed Economic Loop' : 'Замкнутый экономический цикл',
        description: content.cel.definition,
      },
      {
        '@type': 'DefinedTerm',
        name: 'Treasury',
        description: content.blocks.find((block) => block.id === 'circulation')?.answer,
      },
    ],
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: content.breadcrumbHome, item: baseUrl },
      { '@type': 'ListItem', position: 2, name: content.breadcrumbCurrent, item: pageUrl },
    ],
  }
  const toc = [
    [content.definitionTitle, 'definition'],
    [content.problemTitle, 'problem'],
    [content.metricsTitle, 'metrics'],
    [content.blocksTitle, 'eight-blocks'],
    [content.treasury.title, 'treasury'],
    [content.cel.title, 'closed-loop'],
    [content.examplesTitle, 'examples'],
    [content.faqTitle, 'faq'],
  ] as const

  return (
    <article className={styles.page}>
      <JsonLd value={articleSchema} />
      <JsonLd value={faqSchema} />
      <JsonLd value={termSchema} />
      <JsonLd value={breadcrumbSchema} />

      <header className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">{content.breadcrumbHome}</Link>
            <span aria-hidden="true">/</span>
            <span>{content.breadcrumbCurrent}</span>
          </nav>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p className={styles.lead}>{content.lead}</p>
          <div className={styles.meta}>
            <span>{content.authorLabel}: {content.authorName}</span>
            <span aria-hidden="true">·</span>
            <span>{content.publishedLabel}: <time dateTime={content.publishedAt}>{formatDate(content.publishedAt)}</time></span>
            <span aria-hidden="true">·</span>
            <span>{content.updatedLabel}: <time dateTime={content.updatedAt}>{formatDate(content.updatedAt)}</time></span>
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <MethodologyToc label={content.tocLabel} items={toc} />

        <div className={styles.content}>
          <section className={styles.section} aria-labelledby="philosophy">
            <p className={styles.kicker}>01 · {lang === 'en' ? '8Blocks' : 'А8А9'}</p>
            <h2 id="philosophy">{content.philosophyTitle}</h2>
            {content.philosophy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>

          <section id="definition" className={styles.section}>
            <p className={styles.kicker}>02 · TEM / ЭМТ</p>
            <h2>{content.definitionTitle}</h2>
            {content.definition.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className={styles.tableWrap}>
              <table>
                <caption>{content.comparison.caption}</caption>
                <thead>
                  <tr>{content.comparison.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr>
                </thead>
                <tbody>
                  {content.comparison.rows.map((row) => (
                    <tr key={row[0]}>
                      <th scope="row">{row[0]}</th>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="problem" className={styles.section}>
            <p className={styles.kicker}>03 · Problem</p>
            <h2>{content.problemTitle}</h2>
            {content.problem.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>

          <section id="metrics" className={styles.section}>
            <p className={styles.kicker}>04 · Test</p>
            <h2>{content.metricsTitle}</h2>
            <p>{content.metricsLead}</p>
            <div className={styles.metricGrid}>
              {content.metrics.map((metric, index) => (
                <article key={metric.title} className={styles.card}>
                  <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{metric.title}</h3>
                  <p>{metric.text}</p>
                </article>
              ))}
            </div>
            <blockquote>{content.pullQuote}</blockquote>
          </section>

          <section id="eight-blocks" className={styles.section}>
            <p className={styles.kicker}>05 · Framework</p>
            <h2>{content.blocksTitle}</h2>
            <p>{content.blocksLead}</p>
            <div className={styles.wheel} role="list" aria-label={content.blocksTitle}>
              {content.blocks.map((block, index) => (
                <a key={block.id} href={`#${block.id}`} role="listitem">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {block.title}
                </a>
              ))}
              <div className={styles.wheelCenter} aria-hidden="true">
                {lang === 'en' ? (
                  <span className={styles.wheelWordmark} />
                ) : (
                  <strong>А8А9</strong>
                )}
              </div>
            </div>
            <div className={styles.blockList}>
              {content.blocks.map((block, index) => (
                <article key={block.id} id={block.id} className={styles.block}>
                  <div className={styles.blockHeading}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <p>{block.title}</p>
                  </div>
                  <h3>{block.question}</h3>
                  <p className={styles.directAnswer}>{block.answer}</p>
                  {block.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {block.points && (
                    <ul>{block.points.map((point) => <li key={point}>{point}</li>)}</ul>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section id="treasury" className={styles.section}>
            <p className={styles.kicker}>06 · Treasury</p>
            <h2>{content.treasury.title}</h2>
            <p>{content.treasury.description}</p>
            <figure className={styles.flowFigure}>
              <div className={styles.flow}>
                {content.treasury.steps.map((step, index) => (
                  <div key={step} className={styles.flowStep}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{step}</strong>
                  </div>
                ))}
              </div>
              <figcaption>{content.treasury.caption}</figcaption>
            </figure>
          </section>

          <section id="closed-loop" className={styles.section}>
            <p className={styles.kicker}>07 · CEL / ЗЭЦ</p>
            <h2>{content.cel.title}</h2>
            <p className={styles.directAnswer}>{content.cel.definition}</p>
            {content.cel.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className={styles.loop} aria-label={content.cel.title}>
              {content.cel.steps.map((step, index) => (
                <div key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{step}</strong>
                </div>
              ))}
            </div>
            <h3>{content.cel.listingQuestion}</h3>
            <p className={styles.directAnswer}>{content.cel.listingAnswer}</p>
            <ul>{content.cel.listingCriteria.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>

          <section id="examples" className={styles.section}>
            <p className={styles.kicker}>08 · Evidence</p>
            <h2>{content.examplesTitle}</h2>
            <div className={styles.exampleGrid}>
              {content.examples.map((example) => (
                <article key={example.title} className={styles.card}>
                  <h3>{example.title}</h3>
                  <p>{example.text}</p>
                  <a href={example.sourceHref} target="_blank" rel="noopener noreferrer">
                    {example.sourceLabel} ↗
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section id="faq" className={`${styles.section} ${styles.faqSection}`}>
            <p className={styles.kicker}>09 · FAQ</p>
            <h2>{content.faqTitle}</h2>
            <FaqAccordion
              bare
              headingOrder={3}
              items={content.faq.map((item) => ({
                question: item.question,
                answer: item.answer,
              }))}
            />
          </section>

          <aside className={styles.disclaimer}>
            <h2>{content.disclaimerTitle}</h2>
            <p>{content.disclaimer}</p>
          </aside>
        </div>
      </div>
    </article>
  )
}
