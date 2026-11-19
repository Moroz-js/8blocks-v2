import { notFound } from 'next/navigation'
import { siteConfig } from '@/shared/config/site'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!siteConfig.blogEnabled) notFound()
  return <>{children}</>
}
