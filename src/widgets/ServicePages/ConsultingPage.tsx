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

const { common, consulting: page } = servicePages

const PAIN_GLYPHS = [
  { shape: 'compass', oy: 0.5, os: 0.9 },
  { shape: 'target', oy: 0.5, os: 0.9 },
  { shape: 'team', oy: 0.5, os: 0.9 },
  { shape: 'clock', oy: 0.5, os: 0.85 },
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
        <Cta size="sm" title={page.tgeCta.title} description={page.tgeCta.description} primary={common.bookCall} />
      </Section>

      <StrategyDiagram title={page.strategy.title} description={page.strategy.description} stages={page.strategy.stages} />

      <ChecklistRows title={page.deliver.title} items={page.deliver.items} />

      <Section>
        <Cta size="md" title={page.utilityCta.title} description={page.utilityCta.description} primary={common.bookCall} />
      </Section>

      <StepsCarousel title={common.howWeWork} steps={page.steps} labels={common.stepsLabels} numbering="padded" />

      <UseCases title={page.useCases.title} tabsLabel={page.useCases.tabsLabel} items={page.useCases.items} />

      <MiniApp copy={common.miniApp} />

      <ServiceFaq title={common.faq.title} items={page.faq} footer={common.faq.footer} />
    </>
  )
}
