import type { StandardBucketKey } from '@/shared/lib/platform/tokenlab/types'

// Slice colours of the Figma calculator preview (3608:10896): pink, blue,
// green, orange, purple, cyan, coral. The design has seven buckets, the
// engine eight — Team takes Colors/White.
export const BUCKET_COLORS: Record<StandardBucketKey, string> = {
  investors: '#E52D9A',
  community: '#4A8CFF',
  ecosystem: '#3DD68C',
  treasury: '#FFAC4D',
  liquidity: '#9B6DFF',
  foundation: '#37C9D9',
  publicSale: '#F2564D',
  team: '#FFFFFF',
}

// Same definition as the v1 calculator: team, investors and foundation.
export const INSIDER_KEYS: readonly StandardBucketKey[] = ['team', 'investors', 'foundation']
