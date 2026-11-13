import { lang } from '@/shared/i18n'
import * as ru from './ru/tokenomicsAi'
import * as en from './en/tokenomicsAi'

export const tokenomicsAiContent = (lang === 'ru' ? ru : en).tokenomicsAiContent
export type { TokenomicsAiContent } from './en/tokenomicsAi'
