import type { StandardBucketKey, AllocationBucket, VestingConfig } from "./types";

export interface BucketDefinition {
  key: StandardBucketKey;
  label: string;
  category: "insider" | "external" | "infrastructure";
  color: string;
  defaultEnabled: boolean;
  defaultPercent: number;
  defaultVesting: { tgePercent: number; cliffMonths: number; vestingMonths: number };
}

/**
 * Pink/magenta gradient spectrum — dark crimson to bright hot pink.
 * Matches the 8Blocks brand chart reference palette.
 */
export const STANDARD_BUCKETS: BucketDefinition[] = [
  {
    key: "team", label: "Team", category: "insider", color: "#5C0A2A",
    defaultEnabled: true, defaultPercent: 20,
    defaultVesting: { tgePercent: 0, cliffMonths: 12, vestingMonths: 36 },
  },
  {
    key: "investors", label: "Investors", category: "insider", color: "#7A1240",
    defaultEnabled: true, defaultPercent: 15,
    defaultVesting: { tgePercent: 5, cliffMonths: 6, vestingMonths: 24 },
  },
  {
    key: "community", label: "Community", category: "external", color: "#E84690",
    defaultEnabled: true, defaultPercent: 30,
    defaultVesting: { tgePercent: 15, cliffMonths: 0, vestingMonths: 36 },
  },
  {
    key: "ecosystem", label: "Ecosystem", category: "infrastructure", color: "#A31D58",
    defaultEnabled: true, defaultPercent: 15,
    defaultVesting: { tgePercent: 5, cliffMonths: 3, vestingMonths: 48 },
  },
  {
    key: "treasury", label: "Treasury", category: "infrastructure", color: "#3D0820",
    defaultEnabled: true, defaultPercent: 20,
    defaultVesting: { tgePercent: 0, cliffMonths: 6, vestingMonths: 48 },
  },
  {
    key: "liquidity", label: "Liquidity", category: "infrastructure", color: "#F06098",
    defaultEnabled: false, defaultPercent: 0,
    defaultVesting: { tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
  },
  {
    key: "foundation", label: "Foundation", category: "insider", color: "#C43070",
    defaultEnabled: false, defaultPercent: 0,
    defaultVesting: { tgePercent: 0, cliffMonths: 12, vestingMonths: 36 },
  },
  {
    key: "publicSale", label: "Public Sale", category: "external", color: "#FF6EB4",
    defaultEnabled: false, defaultPercent: 0,
    defaultVesting: { tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
  },
];

export function getBucketDef(key: StandardBucketKey): BucketDefinition {
  return STANDARD_BUCKETS.find((b) => b.key === key)!;
}

export function getDefaultAllocations(): AllocationBucket[] {
  return STANDARD_BUCKETS.map((b) => ({
    key: b.key,
    percent: b.defaultPercent,
    enabled: b.defaultEnabled,
  }));
}

export function getDefaultVestingConfigs(): VestingConfig[] {
  return STANDARD_BUCKETS.map((b) => ({
    bucketKey: b.key,
    ...b.defaultVesting,
  }));
}
