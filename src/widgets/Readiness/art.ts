import type { StaticImageData } from 'next/image'
import type { ReadinessContent } from '@/shared/content/readiness'
import { PATHS, type PathId } from '@/shared/lib/platform/readiness/scoring'
import realEstate from '@/widgets/ServicePages/assets/asset-realestate.webp'
import debt from '@/widgets/ServicePages/assets/asset-debt.webp'
import securities from '@/widgets/ServicePages/assets/asset-securities.webp'
import movables from '@/widgets/ServicePages/assets/asset-movables.webp'
import house from '@/widgets/ServicePages/assets/ic-house.svg'
import book from '@/widgets/ServicePages/assets/ic-book.svg'
import car from '@/widgets/ServicePages/assets/ic-car.svg'
import moneybag from '@/widgets/ServicePages/assets/ic-moneybag.svg'
import type { SituationItem } from '@/widgets/ServicePages/blocks/SituationTabs'

/** Tab icon and photo per path; «Other» shows the designer's high-value movables example. */
export const PATH_ART: Record<PathId, { icon: StaticImageData; image: StaticImageData }> = {
  asset_backed: { icon: house, image: realEstate },
  credit: { icon: book, image: debt },
  funds: { icon: moneybag, image: securities },
  other: { icon: car, image: movables },
}

/** Path copy as situation tabs; `tabs` overrides the tab labels and order (landing). */
export function situationItems(
  paths: ReadinessContent['paths'],
  tabs?: readonly { path: PathId; label: string }[],
): SituationItem[] {
  return (tabs ?? PATHS.map((path) => ({ path, label: paths.items[path].name }))).map(({ path, label }) => ({
    ...paths.items[path],
    ...PATH_ART[path],
    id: path,
    tab: label,
  }))
}
