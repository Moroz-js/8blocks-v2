import { lang } from '@/shared/i18n'
import * as ru from './ru/articlePage'
import * as en from './en/articlePage'

const locale = lang === 'ru' ? ru : en

export const articlePageContent = locale.articlePageContent
