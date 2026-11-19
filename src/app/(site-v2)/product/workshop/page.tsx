import type { Metadata } from 'next'
import { lang } from '@/shared/i18n'
import { servicePages } from '@/shared/content/servicePages'
import { getSiteSeoGlobal } from '@/shared/lib/site-seo/get-site-seo'
import { resolveWorkshopTrustSlotsNote } from '@/shared/lib/site-seo/workshop-trust-slots'
import { WorkshopPage } from '@/widgets/ServicePages/WorkshopPage'
import { servicePageMetadata } from '@/widgets/ServicePages/metadata'

export function generateMetadata(): Promise<Metadata> {
  return servicePageMetadata('/product/workshop', servicePages.workshop.meta)
}

export default async function WorkshopRoute() {
  const siteSeo = await getSiteSeoGlobal()
  return <WorkshopPage slotsNote={resolveWorkshopTrustSlotsNote(lang, siteSeo)} />
}
