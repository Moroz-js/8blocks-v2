import { lang } from '@/shared/i18n'
import * as ru from './ru/tokenomics'
import * as en from './en/tokenomics'

const locale = lang === 'ru' ? ru : en

export const tokenomicsContent = locale.tokenomicsContent
export const tokenomicsMeta = locale.tokenomicsMeta
export const tokenomicsCompositionContent = locale.tokenomicsCompositionContent
export const tokenomicsProcessContent = locale.tokenomicsProcessContent
