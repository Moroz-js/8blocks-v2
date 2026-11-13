import { Button, Cta, Section } from '@/shared/ds'
import { servicePages } from '@/shared/content/servicePages'
import { ServiceHero } from './blocks/ServiceHero'
import { GlyphCards } from './blocks/GlyphCards'
import { ExpandingCards } from './blocks/ExpandingCards'
import { LabeledRows, SplitList } from './blocks/SplitList'
import { MiniApp } from './blocks/MiniApp'
import { ServiceFaq } from './blocks/ServiceFaq'
import styles from './pages.module.scss'

const { common, audit: page } = servicePages

const PAIN_GLYPHS = [
  { shape: 'slabcrack', oy: 0.52, os: 1 },
  { shape: 'barsweak', oy: 0.44, os: 0.78 },
  { shape: 'chainbreak', oy: 0.52, os: 1 },
  { shape: 'hourglass', oy: 0.52, os: 1 },
]

const REVIEW_GLYPHS = [
  { shape: 'coinstacks', oy: 0.51, os: 1.25 },
  { shape: 'bars', oy: 0.385, os: 1.12 },
  { shape: 'target', oy: 0.514, os: 0.74 },
  { shape: 'scales', oy: 0.5, os: 0.92 },
  { shape: 'gear', oy: 0.5, os: 0.97 },
]

export function AuditPage() {
  const review = page.review.items.map((item, i) => ({ ...item, glyph: REVIEW_GLYPHS[i] }))
  return (
    <>
      <ServiceHero scene="light-bulb" title={page.hero.title} description={page.hero.description}>
        <Button href={common.bookCall.href}>{common.bookCall.label}</Button>
      </ServiceHero>

      <Section title={page.pains.title} description={page.pains.description}>
        <GlyphCards
          columns={2}
          height={300}
          glyph={{ height: 215 }}
          items={page.pains.items.map((item, i) => ({ ...item, glyph: PAIN_GLYPHS[i] }))}
        />
      </Section>

      <ExpandingCards title={page.when.title} description={page.when.description} items={page.when.items} />

      <Section title={page.review.title} description={page.review.description} align="center">
        <div className={styles.cardRows} data-accent-group>
          <GlyphCards columns={3} height={360} glyph={{ height: 245 }} text="under" accent accentGroup={false} items={review.slice(0, 3)} />
          <GlyphCards columns={2} height={360} glyph={{ height: 245 }} accent accentGroup={false} items={review.slice(3)} />
        </div>
      </Section>

      <Section>
        <Cta size="md" title={page.outcomeCta.title} description={page.outcomeCta.description} primary={common.bookCall} />
      </Section>

      <SplitList title={page.problems.title} titleSize="sm">
        <LabeledRows items={page.problems.items} numbered />
      </SplitList>

      <MiniApp copy={common.miniApp} />

      <Section>
        <Cta size="md" title={page.cta.title} description={page.cta.description} primary={common.bookCall} />
      </Section>

      <ServiceFaq title={common.faq.title} items={page.faq} footer={common.faq.footer} />
    </>
  )
}
