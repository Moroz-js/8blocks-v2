import type { Metadata } from 'next'
import { servicePages } from '@/shared/content/servicePages'
import { AuditPage } from '@/widgets/ServicePages/AuditPage'
import { servicePageMetadata } from '@/widgets/ServicePages/metadata'

export function generateMetadata(): Promise<Metadata> {
  return servicePageMetadata('/services/audit', servicePages.audit.meta)
}

export default function AuditRoute() {
  return <AuditPage />
}
