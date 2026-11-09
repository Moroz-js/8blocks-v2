import { Button, Section } from '@/shared/ds'
import type { ReadinessContent } from '@/shared/content/readiness'
import { encodeAnswers, SAMPLE_ANSWERS } from '@/shared/lib/platform/readiness/scoring'
import { GlyphCards } from '@/widgets/ServicePages/blocks/GlyphCards'
import { ServiceFaq } from '@/widgets/ServicePages/blocks/ServiceFaq'
import { ServiceHero } from '@/widgets/ServicePages/blocks/ServiceHero'
import { SituationTabs } from '@/widgets/ServicePages/blocks/SituationTabs'
import { TeamCta } from '@/widgets/ServicePages/blocks/TeamCta'
import { situationItems } from './art'
import { Quiz } from './Quiz'
import { RESULT_PATH } from './paths'
import { StatusExplorer } from './StatusExplorer'
import styles from './ReadinessCheckPage.module.scss'

const FOUR_GLYPHS = ['target', 'deed', 'coin', 'gear']

const Chevron = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M5 8l5 5 5-5" />
  </svg>
)

export function ReadinessCheckPage({ content }: { content: ReadinessContent }) {
  const { hero, four, team } = content
  return (
    <>
      <ServiceHero
        scene="skyline"
        artTop={-8}
        titleSize="md"
        layout="spread"
        title={hero.title}
        description={hero.description}
        footnote={hero.privacy}
      >
        <Button href="#quiz">{hero.start}</Button>
        <Button variant="tertiary" href={`${RESULT_PATH}?a=${encodeAnswers(SAMPLE_ANSWERS)}`}>
          {hero.sample}
        </Button>
      </ServiceHero>

      <Section>
        <StatusExplorer
          heading={content.statusSection}
          statuses={content.statuses}
          pillars={content.pillars}
          chartLabel={content.chartLabel}
        />
      </Section>

      <Section title={content.paths.title} description={content.paths.description} align="center">
        <SituationTabs label={content.paths.title} labels={content.paths.labels} items={situationItems(content.paths)} />
      </Section>

      <Section>
        <Quiz content={content.quiz} />
      </Section>

      <Section title={four.title} description={four.description} align="center">
        <GlyphCards
          columns={4}
          height={360}
          glyph={{ height: 250 }}
          align="center"
          items={four.items.map((item, i) => ({ ...item, glyph: { shape: FOUR_GLYPHS[i], os: 0.75 } }))}
        />
        <details className={styles.means}>
          <summary className={styles.meansToggle}>
            {four.meansToggle}
            {Chevron}
          </summary>
          <p className={styles.meansText}>{four.means}</p>
        </details>
      </Section>

      <TeamCta {...team} />

      <ServiceFaq title={content.faq.title} items={content.faq.items} footer={content.faq.footer} />
    </>
  )
}
