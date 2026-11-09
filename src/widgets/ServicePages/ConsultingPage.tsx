import { Button, Cta, Section } from '@/shared/ds'
import { servicePages } from '@/shared/content/servicePages'
import { ServiceHero } from './blocks/ServiceHero'
import { GlyphCards } from './blocks/GlyphCards'
import { StrategyDiagram } from './blocks/StrategyDiagram'
import { ChecklistRows } from './blocks/ChecklistRows'
import { StepsCarousel } from './blocks/StepsCarousel'
import { UseCases } from './blocks/UseCases'
import { MiniApp } from './blocks/MiniApp'
import { ServiceFaq } from './blocks/ServiceFaq'
import ctaTge from './assets/sc-tge-bg.webp'
import ctaPink from './assets/cta-pink.webp'

const { common, consulting: page } = servicePages

const PAIN_GLYPHS = [
  { shape: 'trail', oy: 0.48, os: 0.82 },
  { shape: 'bubbles', oy: 0.5, os: 0.9 },
  { shape: 'puzzlegap', oy: 0.5, os: 0.95 },
  { shape: 'chaos', oy: 0.5, os: 0.9 },
]

export function ConsultingPage() {
  return (
    <>
      <ServiceHero scene="hand-coins" artTop={-110} titleSize="md" title={page.hero.title} description={page.hero.description}>
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

      <Section>
        <Cta size="sm" image={ctaTge} title={page.tgeCta.title} description={page.tgeCta.description} primary={common.bookCall} />
      </Section>

      <StrategyDiagram title={page.strategy.title} description={page.strategy.description} stages={page.strategy.stages} />

      <ChecklistRows title={page.deliver.title} items={page.deliver.items} />

      <Section>
        <Cta size="md" image={ctaPink} title={page.utilityCta.title} description={page.utilityCta.description} primary={common.bookCall} />
      </Section>

      <StepsCarousel title={common.howWeWork} steps={page.steps} labels={common.stepsLabels} numbering="padded" />

      <UseCases title={page.useCases.title} tabsLabel={page.useCases.tabsLabel} items={page.useCases.items} />

      <MiniApp copy={common.miniApp} />

      <ServiceFaq title={common.faq.title} items={page.faq} footer={common.faq.footer} />
    </>
  )
}
