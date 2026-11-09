// Design system v2 — public API. Use only on pages under src/app/(site-v2).
// Must not import from @/shared/ui or @/shared/styles (system v1).

// Elements
export { Button } from './ui/Button'
export type { ButtonProps, ButtonVariant } from './ui/Button'
export { Tabs } from './ui/Tabs'
export type { TabItem } from './ui/Tabs'
export { TextField, Textarea } from './ui/TextField'
export { ArrowLink, Divider, Eyebrow, IconButton, Meta, Pill, StepNumber } from './ui/Elements'
export { Hint, HintTooltip } from './ui/Hint'

// Blocks
export { Section } from './blocks/Section'
export { FeatureCards } from './blocks/FeatureCards/FeatureCards'
export type { FeatureCardItem } from './blocks/FeatureCards/FeatureCards'
export { Metrics } from './blocks/Metrics/Metrics'
export type { MetricItem } from './blocks/Metrics/Metrics'
export { Roadmap } from './blocks/Roadmap/Roadmap'
export type { RoadmapStep } from './blocks/Roadmap/Roadmap'
export { Faq } from './blocks/Faq/Faq'
export type { FaqItem } from './blocks/Faq/Faq'
export { Cta } from './blocks/Cta/Cta'
export { CaseList } from './blocks/CaseList/CaseList'
export type { CaseListItem } from './blocks/CaseList/CaseList'
export { Carousel } from './blocks/Carousel/Carousel'
export { AccentCard, QuoteCard } from './blocks/Carousel/Cards'
export { ComparisonTable } from './blocks/ComparisonTable/ComparisonTable'
export type { ComparisonRow } from './blocks/ComparisonTable/ComparisonTable'
export { FormBlock, FormRow } from './blocks/FormBlock/FormBlock'
export { ScorePetals } from './blocks/ScorePetals/ScorePetals'
export { PETAL_LEVELS, petalTone } from './blocks/ScorePetals/petals'
export type { Petal, PetalTone } from './blocks/ScorePetals/petals'
