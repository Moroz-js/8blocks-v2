import Link from 'next/link'
import { tokenLabCalculator as content } from '@/shared/content/tokenLabCalculator'
import { createDefaultModel } from '@/shared/lib/platform/tokenlab/model'
import {
  applyTemplate,
  MODEL_TEMPLATES,
} from '@/shared/lib/platform/tokenlab/presets'
import { encodeModel } from '@/shared/lib/platform/tokenlab/urlState'
import { lang } from '@/shared/i18n'
import { CalculatorShell } from './CalculatorShell'
import { MarketingSections } from './MarketingSections'
import styles from './TokenLab.module.scss'

const sampleUrl = `?m=${encodeModel({
  ...applyTemplate(createDefaultModel(), MODEL_TEMPLATES[0]),
  name: 'Sample Protocol',
  symbol: 'SMPL',
})}`
const isRussian = lang === 'ru'

export function TokenLabPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroInner}>
            <span className={styles.eyebrow}>{content.hero.eyebrow}</span>
            <h1 className={styles.title}>{content.hero.title}</h1>
            <p className={styles.lead}>{content.hero.description}</p>
            <div className={styles.scoreActions}>
              <a href="#calculator" className={styles.linkButton}>
                {content.toolLabel} →
              </a>
              <Link href={sampleUrl} className={styles.ghostButton}>
                {isRussian ? 'Посмотреть пример' : 'See a sample result'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="calculator" className={styles.toolSection}>
        <div className={styles.container}>
          <div className={styles.resultHeader}>
            <span className={styles.label}>{content.toolLabel}</span>
            <span className={styles.fine}>{content.toolNote}</span>
          </div>
          <CalculatorShell />
        </div>
      </section>

      <MarketingSections>
        <section className={styles.marketing}>
          <div className={styles.container}>
            <span className={styles.label}>{content.how.label}</span>
            <h2 className={styles.sectionTitle}>{content.how.title}</h2>
            <div className={styles.marketingGrid}>
              {content.how.items.map((item, index) => (
                <article key={item.title} className={styles.marketingCard}>
                  <span className={styles.label}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.marketing} ${styles.marketingAlt}`}>
          <div className={styles.container}>
            <span className={styles.label}>{content.covers.label}</span>
            <h2 className={styles.sectionTitle}>{content.covers.title}</h2>
            <div className={styles.marketingGrid}>
              {content.covers.items.map((item) => (
                <article key={item.title} className={styles.marketingCard}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.marketing}>
          <div className={styles.container}>
            <span className={styles.label}>{content.layers.label}</span>
            <h2 className={styles.sectionTitle}>{content.layers.title}</h2>
            <p className={styles.sectionLead}>{content.layers.description}</p>
            <div className={`${styles.marketingGrid} ${styles.grid2}`}>
              {[content.layers.self, content.layers.expert].map((item) => (
                <article
                  key={item.title}
                  className={`${styles.marketingCard} ${
                    item === content.layers.expert ? styles.cardAccent : ''
                  }`}
                >
                  <span className={styles.label}>{item.tag}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  {item === content.layers.expert && (
                    <div className={styles.scoreActions}>
                      <Link href="/services/audit" className={styles.linkButton}>
                        {isRussian ? 'Запросить аудит' : 'Request an audit'}
                      </Link>
                      <Link href="/contact" className={styles.ghostButton}>
                        {isRussian ? 'Забронировать звонок' : 'Book a call'}
                      </Link>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      </MarketingSections>

      <section className={`${styles.marketing} ${styles.marketingAlt}`}>
        <div className={styles.container}>
          <span className={styles.label}>{content.readiness.label}</span>
          <h2 className={styles.sectionTitle}>{content.readiness.title}</h2>
          <p className={styles.sectionLead}>{content.readiness.text}</p>
          <div className={styles.scoreActions}>
            <Link
              href="/product/tokenization-readiness"
              className={styles.ghostButton}
            >
              {content.readiness.action}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
