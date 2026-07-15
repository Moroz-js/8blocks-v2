export interface LaunchModulePackageView {
  id: string
  label: string
  price: number
  durationWeeks: number | null
}

export interface LaunchModuleView {
  id: string
  name: string
  durationLabel: string
  durationWeeks: number
  parallel: boolean
  price: number
  priceFrom: boolean
  includeInTotal: boolean
  description: string
  packages: LaunchModulePackageView[]
}
