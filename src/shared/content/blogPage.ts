import { lang } from '@/shared/i18n'
import * as ru from './ru/blogPage'
import * as en from './en/blogPage'

const locale = lang === 'ru' ? ru : en

export const blogMeta = locale.blogMeta
export const blogArchiveContent = locale.blogArchiveContent
export const blogPreviewContent = locale.blogPreviewContent
