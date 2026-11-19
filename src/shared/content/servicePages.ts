import { lang } from '@/shared/i18n'
import * as ru from './ru/servicePages'
import * as en from './en/servicePages'

export const servicePages = lang === 'ru' ? ru.servicePages : en.servicePages
export type { ServicePagesContent } from './en/servicePages'
