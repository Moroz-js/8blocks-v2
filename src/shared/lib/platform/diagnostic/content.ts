import { lang } from '../../../i18n'
import enContent from './content.json'
import ruContent from './content.ru.json'

export const diagnosticContent =
  lang === 'ru' ? ruContent : enContent
