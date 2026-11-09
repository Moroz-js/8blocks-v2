import { Button, Cta, Section } from '@/shared/ds'
import { servicePages } from '@/shared/content/servicePages'
import { ServiceHero } from './blocks/ServiceHero'
import { GlyphCards } from './blocks/GlyphCards'
import { ExpandingCards } from './blocks/ExpandingCards'
import { LabeledRows, SplitList } from './blocks/SplitList'
import { MiniApp } from './blocks/MiniApp'
import { ServiceFaq } from './blocks/ServiceFaq'
import review1 from './assets/audit-rv-1.webp'
import review2 from './assets/audit-rv-2.webp'
import review3 from './assets/audit-rv-3.webp'
import review4 from './assets/audit-rv-4.webp'
import review5 from './assets/audit-rv-5.webp'
import ctaAudit from './assets/cta-audit.webp'
import ctaPink from './assets/cta-pink.webp'
import styles from './pages.module.scss'

const { common, audit: page } = servicePages

const PAIN_GLYPHS = [
  { shape: 'slabcrack', oy: 0.52, os: 1 },
  { shape: 'barsweak', oy: 0.44, os: 0.78 },
  { shape: 'chainbreak', oy: 0.52, os: 1 },
  { shape: 'timelate', oy: 0.52, os: 1 },
]

const REVIEW_GLYPHS = [
  { shape: 'buckets', oy: 0.51, os: 1.25 },
  { shape: 'bars', oy: 0.385, os: 1.12 },
  { shape: 'target', oy: 0.514, os: 0.74 },
  { shape: 'scales', oy: 0.5, os: 0.92 },
  { shape: 'gear', oy: 0.5, os: 0.97 },
]
const REVIEW_IMAGES = [review1, review2, review3, review4, review5]

export function AuditPage() {
  const review = page.review.items.map((item, i) => ({ ...item, glyph: REVIEW_GLYPHS[i], image: REVIEW_IMAGES[i] }))
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
        <div className={styles.cardRows}>
          <GlyphCards columns={3} height={360} glyph={{ height: 245 }} text="under" items={review.slice(0, 3)} />
          <GlyphCards columns={2} height={360} glyph={{ height: 245 }} items={review.slice(3)} />
        </div>
      </Section>

      <Section>
        <Cta
          size="md"
          image={ctaAudit}
          title={page.outcomeCta.title}
          description={page.outcomeCta.description}
          primary={common.bookCall}
        />
      </Section>

      <SplitList title={page.problems.title} titleSize="sm">
        <LabeledRows items={page.problems.items} numbered />
      </SplitList>

      <MiniApp copy={common.miniApp} />

      <Section>
        <Cta size="md" image={ctaPink} title={page.cta.title} description={page.cta.description} primary={common.bookCall} />
      </Section>

      <ServiceFaq title={common.faq.title} items={page.faq} footer={common.faq.footer} />
    </>
  )
}
