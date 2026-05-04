import type { Metadata } from 'next'
import { workshopContent, workshopMeta } from '@/shared/content/workshop'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'

import { WorkshopHero } from '@/widgets/WorkshopHero'
import { WorkshopPain } from '@/widgets/WorkshopPain'
import { WorkshopExplainer } from '@/widgets/WorkshopExplainer'
import { WhenNeededBlock } from '@/widgets/WhenNeededBlock'
import { WorkshopDeliverables } from '@/widgets/WorkshopDeliverables'
import { ProcessSteps } from '@/widgets/ProcessSteps'
import { WorkshopQuestions } from '@/widgets/WorkshopQuestions'
import { WorkshopComparison } from '@/widgets/WorkshopComparison'
import { WorkshopSpecialists } from '@/widgets/WorkshopSpecialists'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import { WorkshopTestimonial } from '@/widgets/WorkshopTestimonial'
import { ServiceCtaBlock } from '@/widgets/ServiceCtaBlock'

const {
  hero,
  pain,
  explainer,
  audience,
  deliverables,
  upsell,
  process,
  questions,
  comparison,
  specialists,
  testimonial,
  trust,
  faq,
  cta,
} = workshopContent

const canonicalUrl = `${siteConfig.url.replace(/\/$/, '')}/product/workshop`

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/product/workshop', {
    title: workshopMeta.title,
    description: workshopMeta.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: workshopMeta.ogTitle,
      description: workshopMeta.ogDescription,
      url: '/product/workshop',
    },
    twitter: {
      card: 'summary_large_image',
      title: workshopMeta.twitterTitle,
      description: workshopMeta.twitterDescription,
    },
  })
}

export default function WorkshopPage() {
  return (
    <>
      <WorkshopHero
        label={hero.label}
        stat={hero.stat}
        statSource={hero.statSource}
        statSourceUrl={hero.statSourceUrl}
        headline={hero.headline}
        description={hero.description}
        price={hero.price}
        duration={hero.duration}
        audience={hero.audience}
        cta1Label={hero.cta1Label}
        cta1Href={hero.cta1Href}
        cta2Label={hero.cta2Label}
        cta2Href={hero.cta2Href}
      />

      <WorkshopPain
        headline={pain.headline}
        description={pain.description}
        personas={pain.personas}
        timeline={pain.timeline}
        closingNote={pain.closingNote}
      />

      <WorkshopExplainer
        headline={explainer.headline}
        subtitle={explainer.subtitle}
        cards={explainer.cards}
      />

      <WhenNeededBlock
        headline={audience.headline}
        description={audience.description}
        items={audience.items as unknown as string[]}
      />

      <WorkshopDeliverables
        headline={deliverables.headline}
        description={deliverables.description}
        items={deliverables.items}
        upsell={upsell}
      />

      <ProcessSteps headline={process.headline} steps={process.steps as unknown as import('@/widgets/ProcessSteps').ProcessStep[]} />

      <WorkshopQuestions
        headline={questions.headline}
        description={questions.description}
        items={questions.items}
        accentQuestion={questions.accentQuestion}
      />

      <WorkshopComparison
        headline={comparison.headline}
        columns={comparison.columns}
        rows={comparison.rows}
      />

      <WorkshopSpecialists
        headline={specialists.headline}
        description={specialists.description}
        items={specialists.items}
      />

      <FaqAccordion headline={faq.headline} items={faq.items as unknown as import('@/widgets/FaqAccordion').FaqItem[]} />

      <WorkshopTestimonial
        testimonial={testimonial}
        trust={trust}
      />

      <ServiceCtaBlock
        headline={cta.headline}
        ctaLabel={cta.cta1Label}
        ctaHref={hero.cta1Href}
      />
    </>
  )
}
