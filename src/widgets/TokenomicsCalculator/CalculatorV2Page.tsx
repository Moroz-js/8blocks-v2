import Image from 'next/image'
import Link from 'next/link'
import { Button, Faq, FeatureCards, Section } from '@/shared/ds'
import { calculatorV2 as copy } from '@/shared/content/calculatorV2'
import { BinaryArtCanvas } from './BinaryArtCanvas'
import { Calculator } from './Calculator'
import heroFade from './assets/hero-fade.webp'
import stepsGradient from './assets/steps-gradient.webp'
import styles from './TokenomicsCalculator.module.scss'

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '')
const HAND_ART = `${basePath}/img/calculator/hand-reference.png`
const TOOL_ID = 'calculator'

/** Tokenomics calculator page on design system v2 (Figma «Website», 3608:10888). */
export function CalculatorV2Page() {
  return (
    <>
      {/* Figma 3608:10889 */}
      <section className={styles.hero} aria-labelledby="calculator-title">
        <div className={styles.glowWide} aria-hidden="true" />
        <div className={styles.glowNarrow} aria-hidden="true" />
        <div className={styles.art}>
          <BinaryArtCanvas src={HAND_ART} />
        </div>
        <Image src={heroFade} alt="" className={styles.fade} sizes="100vw" />
        <div className={styles.heroInner}>
          <h1 id="calculator-title" className={styles.heroTitle}>
            <span className={styles.heroEyebrow}>{copy.hero.eyebrow}</span>
            <span>{copy.hero.title}</span>
          </h1>
          <Button href={`#${TOOL_ID}`}>{copy.hero.cta}</Button>
        </div>
      </section>

      {/* Figma 3608:10896 — the design shows the calculator as a picture; this is the live tool. */}
      <Section id={TOOL_ID} className={styles.toolSection}>
        <Calculator />
      </Section>

      {/* Figma 3608:10897 + 3608:10898 */}
      <Section>
        <div className={styles.steps}>
          <h2 className={styles.stepsTitle}>{copy.steps.title}</h2>
          <ol className={styles.stepsCard}>
            <Image src={stepsGradient} alt="" fill sizes="(max-width: 1024px) 100vw, 800px" className={styles.stepsBg} />
            {copy.steps.items.map((step, i) => (
              <li key={step.title} className={styles.step}>
                <h3 className={styles.stepTitle}>
                  {i + 1}. {step.title}
                </h3>
                <ul className={styles.stepPoints}>
                  {step.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Figma 3608:11074 + 3608:11075 */}
      <Section>
        <div className={styles.features}>
          <h2 className={styles.featuresTitle}>{copy.features.title}</h2>
          <div className={styles.featureRows}>
            {copy.features.rows.map((row, i) => (
              <FeatureCards key={i} variant="compact" columns={3} items={row} className={i > 0 ? styles.featureRowTight : undefined} />
            ))}
          </div>
        </div>
      </Section>

      {/* Figma 3608:11096 */}
      <Section narrow>
        <div className={styles.faq}>
          <h2 className={styles.faqTitle}>{copy.faq.title}</h2>
          <Faq
            items={copy.faq.items}
            footer={
              <>
                {copy.faq.footerText}
                <Link href="/contact">{copy.faq.footerLink}</Link>
              </>
            }
          />
        </div>
      </Section>
    </>
  )
}
