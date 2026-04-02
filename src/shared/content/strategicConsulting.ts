import { lang } from '@/shared/i18n'
import * as ru from './ru/strategicConsulting'
import * as en from './en/strategicConsulting'

const locale = lang === 'ru' ? ru : en

export const strategicConsultingContent = locale.strategicConsultingContent
export const consultingMeta = locale.consultingMeta
export const consultingDeliverablesContent = locale.consultingDeliverablesContent
export const consultingMapLabels = locale.consultingMapLabels
