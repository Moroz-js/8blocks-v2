import { notFound } from 'next/navigation'
import { siteConfig } from '@/shared/config/site'

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!siteConfig.servicesEnabled) notFound()
  return <>{children}</>
}
