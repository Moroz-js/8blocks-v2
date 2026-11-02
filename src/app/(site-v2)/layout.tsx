// CSS order matters: Mantine base first, then the design system's globals.
import '@mantine/core/styles.css'
import '../globals-v2.scss'
import { SiteShell, siteMetadata } from '../_site-shell/SiteShell'

// Root layout for pages on design system v2 (docs/design-system-v2.md).
// Pages move here from (site) one by one; header and footer are shared.
export const metadata = siteMetadata

export default function SiteV2Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell system="v2">{children}</SiteShell>
}
