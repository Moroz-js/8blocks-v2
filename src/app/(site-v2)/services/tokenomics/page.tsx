import type { Metadata } from 'next'
import { servicePages } from '@/shared/content/servicePages'
import { TokenomicsPage } from '@/widgets/ServicePages/TokenomicsPage'
import { servicePageMetadata } from '@/widgets/ServicePages/metadata'

export function generateMetadata(): Promise<Metadata> {
  return servicePageMetadata('/services/tokenomics', servicePages.tokenomics.meta)
}

export default function TokenomicsRoute() {
  return <TokenomicsPage />
}
