import { lang } from '@/shared/i18n'
import * as en from './en/readiness'
import * as ru from './ru/readiness'

export type { ReadinessContent } from './en/readiness'

export const readiness = lang === 'ru' ? ru.readiness : en.readiness
