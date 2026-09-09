import { lang } from '@/shared/i18n'
import * as ru from './ru/eventsPage'
import * as en from './en/eventsPage'

const locale = lang === 'ru' ? ru : en

export const eventsMeta = locale.eventsMeta
export const eventsContent = locale.eventsContent
