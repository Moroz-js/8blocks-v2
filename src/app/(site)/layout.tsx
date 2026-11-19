// CSS order matters: Mantine base first, then the design system's globals.
import '@mantine/core/styles.css'
import '../globals.scss'
import { SiteShell, siteMetadata } from '../_site-shell/SiteShell'

// Root layout for pages on the current design system (docs/styleguide.md).
export const metadata = siteMetadata

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell system="v1" topBlur>
      {children}
    </SiteShell>
  )
}
