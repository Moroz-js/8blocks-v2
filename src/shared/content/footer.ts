import { lang } from '@/shared/i18n'
import * as ru from './ru/footer'
import * as en from './en/footer'

const locale = lang === 'ru' ? ru : en

export const footerContent = locale.footerContent
