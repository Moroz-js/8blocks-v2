import { Button, Cta, Section } from '@/shared/ds'
import { servicePages } from '@/shared/content/servicePages'
import { ServiceHero } from './blocks/ServiceHero'
import { GlyphCards } from './blocks/GlyphCards'
import { IndexedRows, SplitList } from './blocks/SplitList'
import { StepsCarousel } from './blocks/StepsCarousel'
import { MiniApp } from './blocks/MiniApp'
import { ServiceFaq } from './blocks/ServiceFaq'

const { common, tokenomics: page } = servicePages

const PAIN_GLYPHS = [
  { shape: 'plugout', oy: 0.5, os: 0.92 },
  { shape: 'gauge', oy: 0.5, os: 0.9 },
  { shape: 'drain', oy: 0.47, os: 0.98 },
  { shape: 'crackedcoin', oy: 0.48, os: 0.9 },
]

const APPROACH_GLYPHS = [
  { shape: 'cube', oy: 0.5, os: 0.49 },
  { shape: 'orbit', oy: 0.5, os: 0.47 },
  { shape: 'gear', oy: 0.5, os: 0.71 },
  { shape: 'crane', oy: 0.5, os: 0.43 },
]

export function TokenomicsPage() {
  return (
    <>
      <ServiceHero scene="coin-stacks" artTop={90} title={page.hero.title} description={page.hero.description}>
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

      <Section title={page.approach.title} description={page.approach.description} align="center">
        <GlyphCards
          columns={4}
          height={560}
          glyph={{ height: 380 }}
          text="under"
          align="center"
          accent
          items={page.approach.items.map((item, i) => ({ ...item, glyph: APPROACH_GLYPHS[i] }))}
        />
      </Section>

      <SplitList title={page.parts.title} description={page.parts.description}>
        <IndexedRows items={page.parts.items} />
      </SplitList>

      <StepsCarousel title={common.howWeWork} steps={page.steps} labels={common.stepsLabels} />

      <MiniApp copy={common.miniApp} />

      <Section>
        <Cta size="md" title={page.cta.title} description={page.cta.description} primary={common.bookCall} />
      </Section>

      <ServiceFaq title={common.faq.title} items={page.faq} footer={common.faq.footer} />
    </>
  )
}
