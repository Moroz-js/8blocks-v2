import type { AllocationBucket, VestingConfig } from "./types";

export function calcPricePerToken(fdv: number, supply: number): number {
  return supply > 0 ? fdv / supply : 0;
}

/** Percent of supply liquid at TGE: sum over enabled buckets of percent * tgePercent / 100. */
export function calcInitialCircPercent(
  allocs: AllocationBucket[],
  vestings: VestingConfig[],
): number {
  return allocs
    .filter((a) => a.enabled && a.percent > 0)
    .reduce((sum, a) => {
      const cfg = vestings.find((v) => v.bucketKey === a.key);
      return sum + (cfg ? (a.percent * cfg.tgePercent) / 100 : 0);
    }, 0);
}

export function calcInitialMC(fdv: number, initialCircPercent: number): number {
  return (fdv * initialCircPercent) / 100;
}
