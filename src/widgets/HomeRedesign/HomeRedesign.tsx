import { siteConfig } from '@/shared/config/site'
import { HeroHome } from '@/widgets/HeroHome'
import { ServicesSection } from '@/widgets/ServicesSection'
import { AboutSection } from '@/widgets/AboutSection'
import { PartnersSection } from '@/widgets/PartnersSection'
import { BenefitsSection } from '@/widgets/BenefitsSection'
import { BlogPreview } from '@/widgets/BlogPreview'
import { CtaSection } from '@/widgets/CtaSection'
import styles from './HomeRedesign.module.scss'

/**
 * Та же главная страница, что и сейчас, но с переопределёнными дизайн-токенами
 * (градиент заголовков и розовый акцент) — scoped через CSS-переменные на обёртке.
 */
export function HomeRedesign() {
  return (
    <div className={styles.scope}>
      <HeroHome />
      <ServicesSection />
      <AboutSection />
      <PartnersSection />
      <BenefitsSection />
      {siteConfig.blogEnabled && <BlogPreview />}
      <CtaSection />
    </div>
  )
}
