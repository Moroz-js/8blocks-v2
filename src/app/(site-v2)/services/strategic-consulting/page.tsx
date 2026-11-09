import type { Metadata } from 'next'
import { servicePages } from '@/shared/content/servicePages'
import { ConsultingPage } from '@/widgets/ServicePages/ConsultingPage'
import { servicePageMetadata } from '@/widgets/ServicePages/metadata'

export function generateMetadata(): Promise<Metadata> {
  return servicePageMetadata('/services/strategic-consulting', servicePages.consulting.meta)
}

export default function StrategicConsultingRoute() {
  return <ConsultingPage />
}
