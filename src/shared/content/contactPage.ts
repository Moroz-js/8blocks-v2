import { lang } from '@/shared/i18n'
import * as ru from './ru/contactPage'
import * as en from './en/contactPage'

const locale = lang === 'ru' ? ru : en

export const contactMeta = locale.contactMeta
export const contactPageContent = locale.contactPageContent
export const contactFormContent = locale.contactFormContent
