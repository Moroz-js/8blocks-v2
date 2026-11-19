import { lang } from '@/shared/i18n'
import * as ru from './ru/about'
import * as en from './en/about'

const locale = lang === 'ru' ? ru : en

export const about = locale.about
