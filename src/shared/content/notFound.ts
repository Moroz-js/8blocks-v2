import { lang } from '@/shared/i18n'
import * as ru from './ru/notFound'
import * as en from './en/notFound'

export const notFoundContent = (lang === 'ru' ? ru : en).notFoundContent
