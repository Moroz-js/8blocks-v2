import Image from 'next/image'
import clsx from 'clsx'
import { AccentSurface, Button, Carousel, ComparisonTable, Cta, Roadmap, Section } from '@/shared/ds'
import { servicePages } from '@/shared/content/servicePages'
import { ServiceHero } from './blocks/ServiceHero'
import { GlyphCards } from './blocks/GlyphCards'
import { PartnersMarquee } from './blocks/PartnersMarquee'
import { ServiceFaq } from './blocks/ServiceFaq'
import iconClock from './assets/ws-ic-clock.svg'
import iconCalendar from './assets/ws-ic-calendar.svg'
import iconScenario from './assets/ws-ic-scenario.svg'
import styles from './WorkshopPage.module.scss'

const { common, workshop: page } = servicePages

const PEOPLE_GLYPHS = [
  { shape: 'crackedcoin', os: 0.85 },
  { shape: 'plugout', os: 0.85 },
]
const WHAT_GLYPHS = [
  { shape: 'target', os: 1.15 },
  { shape: 'rocketpad', os: 1.05 },
  { shape: 'returnloop', os: 1.05 },
]
const RESULT_GLYPHS = [
  { shape: 'playbtn', os: 1 },
  { shape: 'docpage', os: 1 },
  { shape: 'concepts', os: 1 },
]
const FACT_ICONS = [iconClock, iconCalendar, iconScenario]

/** Two questions per carousel column, like the designer's two-row grid. */
function questionColumns(items: readonly string[]) {
  const columns: { text: string; index: number }[][] = []
  items.forEach((text, index) => {
    if (index % 2 === 0) columns.push([])
    columns[columns.length - 1].push({ text, index })
  })
  return columns
}

export function WorkshopPage({ slotsNote }: { slotsNote: string }) {
  const { hero } = page
  const lastQuestion = page.questions.items.length - 1
  return (
    <>
      <ServiceHero
        scene="coin-pedestal"
        layout="spread"
        titleSize="md"
        title={hero.title}
        description={hero.description}
        aside={
          <p className={styles.stat}>
            <a href={hero.stat.sourceHref} target="_blank" rel="noopener noreferrer" title={hero.stat.sourceTitle} className={styles.statSource}>
              {hero.stat.source}
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M8 2h4v4M12 2L6.5 7.5M10 8.5V11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2.5" />
              </svg>
            </a>
            <span>{hero.stat.text}</span>
          </p>
        }
      >
        <Button href={hero.book.href}>{hero.book.label}</Button>
        <Button variant="tertiary" href={hero.failure.href}>
          {hero.failure.label}
        </Button>
        <ul className={styles.heroFacts}>
          {hero.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </ServiceHero>

      <Section id="ws-pain" title={page.people.title} description={page.people.description}>
        <GlyphCards
          columns={2}
          height={400}
          glyph={{ top: 50, height: 220 }}
          items={page.people.items.map((item, i) => ({ ...item, glyph: PEOPLE_GLYPHS[i] }))}
        />
      </Section>

      <Section title={page.trajectory.title}>
        <Roadmap steps={page.trajectory.items} columns={4} numbering="padded" />
      </Section>

      <Section title={page.what.title} description={page.what.description}>
        <GlyphCards
          columns={3}
          height={400}
          glyph={{ top: 10, height: 240 }}
          items={page.what.items.map((item, i) => ({ ...item, glyph: WHAT_GLYPHS[i] }))}
        />
      </Section>

      <Section>
        <div className={styles.audience}>
          <div className={styles.audienceHead}>
            <p className={styles.eyebrow}>{page.audience.eyebrow}</p>
            <h2 className={styles.audienceTitle}>{page.audience.title}</h2>
          </div>
          <ul className={styles.facts}>
            {page.audience.facts.map((fact, i) => (
              <li key={fact} className={styles.fact}>
                <Image src={FACT_ICONS[i]} alt="" width={24} height={24} />
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title={page.results.title} description={page.results.description} align="center">
        <GlyphCards
          columns={3}
          height={400}
          glyph={{ top: 20, height: 260 }}
          align="center"
          accent
          items={page.results.items.map((item, i) => ({ ...item, glyph: RESULT_GLYPHS[i] }))}
        />
        <Cta
          size="sm"
          image={null}
          title={page.credit.title}
          description={page.credit.description}
          primary={page.credit.action}
          className={styles.credit}
        />
      </Section>

      <Section title={page.steps.title}>
        <Roadmap steps={page.steps.items} numbering="padded" />
      </Section>

      <Carousel title={page.questions.title} description={page.questions.description} sheen={false} slideWidth={298} labels={page.questions.labels}>
        {questionColumns(page.questions.items).map((column, c) => (
          <div key={c} className={styles.questionColumn}>
            {column.map(({ text, index }) => (
              <div key={index} className={clsx(styles.question, index === lastQuestion && styles.questionAccent)}>
                <span className={styles.questionIndex}>
                  {String(index + 1).padStart(2, '0')}
                  {index === lastQuestion && ' →'}
                </span>
                <p className={styles.questionText}>{text}</p>
              </div>
            ))}
          </div>
        ))}
      </Carousel>

      <Section title={page.comparison.title}>
        <ComparisonTable caption={page.comparison.caption} columns={page.comparison.columns} rows={page.comparison.rows} highlight={0} />
      </Section>

      <Section>
        <div className={styles.proof}>
          <figure className={styles.quote}>
            <AccentSurface />
            <svg className={styles.quoteMark} width="46" height="44" viewBox="0 0 45.88 43.72" aria-hidden="true">
              <path d="M45.88 0.43L44.82 8.42C42.19 8.22 40.2 8.74 38.86 9.96C37.51 11.17 36.65 12.84 36.26 14.96C35.88 17.07 35.78 19.41 35.97 21.98H45.88V43.72H27.03V19.09C27.03 12.36 28.66 7.29 31.93 3.9C35.27 0.43 39.92 -0.72 45.88 0.43ZM18.85 0.43L17.79 8.42C15.17 8.22 13.18 8.74 11.83 9.96C10.48 11.17 9.62 12.84 9.23 14.96C8.85 17.07 8.75 19.41 8.95 21.98H18.85V43.72H0V19.09C0 12.36 1.64 7.29 4.91 3.9C8.24 0.43 12.89 -0.72 18.85 0.43Z" />
            </svg>
            <blockquote className={styles.quoteText}>{page.proof.quote}</blockquote>
            <figcaption className={styles.quoteAuthor}>
              <span className={styles.authorName}>{page.proof.author}</span>
              <span className={styles.authorRole}>{page.proof.role}</span>
            </figcaption>
          </figure>
          <div className={styles.trust}>
            <div className={styles.trustTop}>
              <div className={styles.slots}>
                <h3 className={styles.slotsTitle}>{page.proof.slots.title}</h3>
                <p className={styles.slotsText}>{`${page.proof.slots.descriptionPrefix} ${slotsNote}`.trim()}</p>
              </div>
              <dl className={styles.stats}>
                {page.proof.stats.map((stat) => (
                  <div key={stat.value} className={styles.statCard}>
                    <dt className={styles.statValue}>{stat.value}</dt>
                    <dd className={styles.statLabel}>{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className={styles.offices}>{page.proof.offices}</p>
          </div>
        </div>
      </Section>

      <PartnersMarquee label={page.partnersLabel} />

      <ServiceFaq title={common.faq.title} items={page.faq} footer={common.faq.footer} />

      <Section>
        <Cta size="md" title={page.bookCta.title} primary={page.bookCta.action} />
      </Section>
    </>
  )
}
