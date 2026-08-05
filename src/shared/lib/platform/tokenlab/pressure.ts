import type { AllocationBucket, VestingConfig } from "./types";
import { calcTotalMonthlyUnlocks } from "./unlocks";

export type PressureTag = "Low" | "Moderate" | "High";

/** Percent of total supply unlocking in months 0-12 inclusive. */
export function calcUnlockPressure12m(
  allocs: AllocationBucket[],
  vestings: VestingConfig[],
  totalSupply: number,
): number {
  if (totalSupply <= 0) return 0;
  const monthly = calcTotalMonthlyUnlocks(allocs, vestings, totalSupply);
  let sum = 0;
  for (let m = 0; m <= 12 && m < monthly.length; m++) sum += monthly[m];
  return (sum / totalSupply) * 100;
}

/** Spec: Low < 10%, Moderate 10-25%, High > 25%. */
export function getPressureTag(pressure: number): PressureTag {
  if (pressure < 10) return "Low";
  if (pressure <= 25) return "Moderate";
  return "High";
}
