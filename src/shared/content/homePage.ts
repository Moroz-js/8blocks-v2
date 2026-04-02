import { lang } from '@/shared/i18n'
import * as ru from './ru/homePage'
import * as en from './en/homePage'

const locale = lang === 'ru' ? ru : en

export const heroContent = locale.heroContent
export const servicesPageContent = locale.servicesPageContent
export const servicesContent = locale.servicesContent
export const servicesShowcaseContent = locale.servicesShowcaseContent
export const aboutContent = locale.aboutContent
export const partnersContent = locale.partnersContent
export const benefitsContent = locale.benefitsContent
export const teamContent = locale.teamContent
export const tokenEconomyContent = locale.tokenEconomyContent
export const tokenFilterContent = locale.tokenFilterContent
export const tokenomicsTestContent = locale.tokenomicsTestContent
export const servicesFaqContent = locale.servicesFaqContent
export const ctaContent = locale.ctaContent
export const homeMeta = locale.homeMeta
export const servicesMeta = locale.servicesMeta
export const heroMarqueeItems = locale.heroMarqueeItems
export const tokenomicsTestScreens = locale.tokenomicsTestScreens
export const tokenomicsTestAriaLabel = locale.tokenomicsTestAriaLabel
