import type { AllocationBucket } from "./types";

export function calcTotalPercent(allocs: AllocationBucket[]): number {
  return allocs.filter((a) => a.enabled).reduce((sum, a) => sum + a.percent, 0);
}

export function isFullyAllocated(allocs: AllocationBucket[]): boolean {
  return Math.abs(calcTotalPercent(allocs) - 100) < 0.01;
}
