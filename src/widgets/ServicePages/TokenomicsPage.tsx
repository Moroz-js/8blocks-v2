import { Button, Cta, Section } from '@/shared/ds'
import { servicePages } from '@/shared/content/servicePages'
import { ServiceHero } from './blocks/ServiceHero'
import { GlyphCards } from './blocks/GlyphCards'
import { IndexedRows, SplitList } from './blocks/SplitList'
import { StepsCarousel } from './blocks/StepsCarousel'
import { MiniApp } from './blocks/MiniApp'
import { ServiceFaq } from './blocks/ServiceFaq'
import card1 from './assets/tok-card-1.webp'
import card2 from './assets/tok-card-2.webp'
import card3 from './assets/tok-card-3.webp'
import card4 from './assets/tok-card-4.webp'
import ctaPink from './assets/cta-pink.webp'

const { common, tokenomics: page } = servicePages

const PAIN_GLYPHS = [
  { shape: 'plugout', oy: 0.5, os: 0.92 },
  { shape: 'buysell', oy: 0.5, os: 0.95 },
  { shape: 'drain', oy: 0.47, os: 0.98 },
  { shape: 'crackedcoin', oy: 0.48, os: 0.9 },
]

const APPROACH_GLYPHS = [
  { shape: 'cube', oy: 0.533, os: 0.93 },
  { shape: 'orbit', oy: 0.5, os: 0.88 },
  { shape: 'gear', oy: 0.5, os: 0.9 },
  { shape: 'crane', oy: 0.484, os: 0.74 },
]
const APPROACH_IMAGES = [card1, card2, card3, card4]

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
          items={page.approach.items.map((item, i) => ({ ...item, glyph: APPROACH_GLYPHS[i], image: APPROACH_IMAGES[i] }))}
        />
      </Section>

      <SplitList title={page.parts.title} description={page.parts.description}>
        <IndexedRows items={page.parts.items} />
      </SplitList>

      <StepsCarousel title={common.howWeWork} steps={page.steps} labels={common.stepsLabels} />

      <MiniApp copy={common.miniApp} />

      <Section>
        <Cta size="md" image={ctaPink} title={page.cta.title} description={page.cta.description} primary={common.bookCall} />
      </Section>

      <ServiceFaq title={common.faq.title} items={page.faq} footer={common.faq.footer} />
    </>
  )
}
