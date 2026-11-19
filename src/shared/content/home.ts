import { lang } from '@/shared/i18n'
import * as ru from './ru/home'
import * as en from './en/home'

const locale = lang === 'ru' ? ru : en

export const home = locale.home
