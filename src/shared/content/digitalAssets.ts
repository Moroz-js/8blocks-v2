import { lang } from '@/shared/i18n'
import * as ru from './ru/digitalAssets'
import * as en from './en/digitalAssets'

const locale = lang === 'ru' ? ru : en

export const digitalAssetsContent = locale.digitalAssetsContent
export const digitalAssetsMeta = locale.digitalAssetsMeta
