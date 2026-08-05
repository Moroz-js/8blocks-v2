import type { AllocationBucket, VestingConfig, StandardBucketKey } from "./types";

const MIN_HORIZON = 12;
const TAIL_MONTHS = 3;

function activeBuckets(allocs: AllocationBucket[]): AllocationBucket[] {
  return allocs.filter((a) => a.enabled && a.percent > 0);
}

function cfgFor(vestings: VestingConfig[], key: StandardBucketKey): VestingConfig | null {
  return vestings.find((v) => v.bucketKey === key) ?? null;
}

/** Chart/analysis horizon in months: longest schedule plus a tail, never under 12. */
export function calcHorizon(allocs: AllocationBucket[], vestings: VestingConfig[]): number {
  let maxEnd = 0;
  for (const b of activeBuckets(allocs)) {
    const cfg = cfgFor(vestings, b.key);
    if (cfg) maxEnd = Math.max(maxEnd, cfg.cliffMonths + cfg.vestingMonths);
  }
  return Math.max(maxEnd + TAIL_MONTHS, MIN_HORIZON);
}

/**
 * Tokens a bucket unlocks in a given month. Month 0 is TGE; linear vesting runs
 * cliff+1 .. cliff+vestingMonths. With vestingMonths = 0 the non-TGE remainder
 * unlocks in full at max(cliff, 1) - "cliff then full unlock" is a real schedule
 * and the tokens must not silently disappear from the chart and the grade.
 */
export function calcBucketMonthlyUnlock(
  bucket: AllocationBucket,
  cfg: VestingConfig,
  totalSupply: number,
  month: number,
): number {
  const tokens = (totalSupply * bucket.percent) / 100;
  const tge = (tokens * cfg.tgePercent) / 100;
  const remainder = tokens - tge;
  let unlocked = month === 0 ? tge : 0;
  if (remainder > 0) {
    if (cfg.vestingMonths > 0) {
      if (month >= cfg.cliffMonths + 1 && month <= cfg.cliffMonths + cfg.vestingMonths) {
        unlocked += remainder / cfg.vestingMonths;
      }
    } else if (month === Math.max(cfg.cliffMonths, 1)) {
      unlocked += remainder;
    }
  }
  return unlocked;
}

export function calcTotalMonthlyUnlocks(
  allocs: AllocationBucket[],
  vestings: VestingConfig[],
  totalSupply: number,
): number[] {
  const horizon = calcHorizon(allocs, vestings);
  const monthly = new Array<number>(horizon + 1).fill(0);
  for (const b of activeBuckets(allocs)) {
    const cfg = cfgFor(vestings, b.key);
    if (!cfg) continue;
    for (let m = 0; m <= horizon; m++) {
      monthly[m] += calcBucketMonthlyUnlock(b, cfg, totalSupply, m);
    }
  }
  return monthly;
}

export function calcCumulativeCirculating(monthly: number[]): number[] {
  const out: number[] = [];
  let acc = 0;
  for (const m of monthly) {
    acc += m;
    out.push(acc);
  }
  return out;
}

export function calcPeakMonthlyUnlock(monthly: number[]): { month: number; amount: number } {
  let month = 0;
  let amount = 0;
  monthly.forEach((v, i) => {
    if (v > amount) {
      amount = v;
      month = i;
    }
  });
  return { month, amount };
}
