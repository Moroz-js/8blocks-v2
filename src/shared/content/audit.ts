import { lang } from '@/shared/i18n'
import * as ru from './ru/audit'
import * as en from './en/audit'

const locale = lang === 'ru' ? ru : en

export const auditMeta = locale.auditMeta
export const auditContent = locale.auditContent
export const auditZonesContent = locale.auditZonesContent
