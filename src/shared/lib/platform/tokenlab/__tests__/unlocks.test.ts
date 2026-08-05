import { describe, it, expect } from "vitest";
import {
  calcHorizon, calcBucketMonthlyUnlock, calcTotalMonthlyUnlocks,
  calcCumulativeCirculating, calcPeakMonthlyUnlock,
} from "../unlocks";
import type { AllocationBucket, VestingConfig } from "../types";

const S = 1_000_000;

function one(percent: number, cfg: Omit<VestingConfig, "bucketKey">): {
  a: AllocationBucket[]; v: VestingConfig[];
} {
  return {
    a: [{ key: "team", percent, enabled: true }],
    v: [{ bucketKey: "team", ...cfg }],
  };
}

describe("calcHorizon", () => {
  it("is max(cliff+vesting)+3 with a floor of 12", () => {
    const short = one(100, { tgePercent: 100, cliffMonths: 0, vestingMonths: 0 });
    expect(calcHorizon(short.a, short.v)).toBe(12);
    const long = one(100, { tgePercent: 0, cliffMonths: 12, vestingMonths: 36 });
    expect(calcHorizon(long.a, long.v)).toBe(51);
  });
});

describe("calcBucketMonthlyUnlock", () => {
  const bucket: AllocationBucket = { key: "team", percent: 100, enabled: true };
  const cfg: VestingConfig = { bucketKey: "team", tgePercent: 10, cliffMonths: 2, vestingMonths: 4 };
  it("releases TGE at month 0", () => {
    expect(calcBucketMonthlyUnlock(bucket, cfg, S, 0)).toBe(100_000);
  });
  it("releases nothing during cliff", () => {
    expect(calcBucketMonthlyUnlock(bucket, cfg, S, 1)).toBe(0);
    expect(calcBucketMonthlyUnlock(bucket, cfg, S, 2)).toBe(0);
  });
  it("spreads remainder linearly from cliff+1", () => {
    // remainder 900k over 4 months = 225k, months 3..6
    expect(calcBucketMonthlyUnlock(bucket, cfg, S, 3)).toBe(225_000);
    expect(calcBucketMonthlyUnlock(bucket, cfg, S, 6)).toBe(225_000);
    expect(calcBucketMonthlyUnlock(bucket, cfg, S, 7)).toBe(0);
  });
  it("vestingMonths=0 releases the remainder at max(cliff, 1), not never", () => {
    const c: VestingConfig = { bucketKey: "team", tgePercent: 40, cliffMonths: 0, vestingMonths: 0 };
    expect(calcBucketMonthlyUnlock(bucket, c, S, 0)).toBe(400_000);
    expect(calcBucketMonthlyUnlock(bucket, c, S, 1)).toBe(600_000);
    expect(calcBucketMonthlyUnlock(bucket, c, S, 2)).toBe(0);
  });

  it("cliff-then-full-unlock keeps every token on the chart", () => {
    const c: VestingConfig = { bucketKey: "team", tgePercent: 0, cliffMonths: 12, vestingMonths: 0 };
    expect(calcBucketMonthlyUnlock(bucket, c, S, 0)).toBe(0);
    expect(calcBucketMonthlyUnlock(bucket, c, S, 11)).toBe(0);
    expect(calcBucketMonthlyUnlock(bucket, c, S, 12)).toBe(S);
    const { a, v } = one(100, { tgePercent: 0, cliffMonths: 12, vestingMonths: 0 });
    const monthly = calcTotalMonthlyUnlocks(a, v, S);
    expect(monthly.reduce((x, y) => x + y, 0)).toBeCloseTo(S, 5);
  });
});

describe("totals, circulating, peak", () => {
  it("total unlocks sum to the vested whole and circulating is monotonic", () => {
    const { a, v } = one(100, { tgePercent: 10, cliffMonths: 2, vestingMonths: 4 });
    const monthly = calcTotalMonthlyUnlocks(a, v, S);
    expect(monthly.length).toBe(calcHorizon(a, v) + 1);
    const total = monthly.reduce((x, y) => x + y, 0);
    expect(total).toBeCloseTo(S, 5);
    const circ = calcCumulativeCirculating(monthly);
    expect(circ.at(-1)).toBeCloseTo(S, 5);
    for (let i = 1; i < circ.length; i++) expect(circ[i]).toBeGreaterThanOrEqual(circ[i - 1]);
  });
  it("disabled buckets are excluded", () => {
    const a: AllocationBucket[] = [
      { key: "team", percent: 50, enabled: true },
      { key: "investors", percent: 50, enabled: false },
    ];
    const v: VestingConfig[] = [
      { bucketKey: "team", tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
      { bucketKey: "investors", tgePercent: 100, cliffMonths: 0, vestingMonths: 0 },
    ];
    const monthly = calcTotalMonthlyUnlocks(a, v, S);
    expect(monthly[0]).toBe(500_000);
  });
  it("peak finds the largest month", () => {
    const { a, v } = one(100, { tgePercent: 30, cliffMonths: 0, vestingMonths: 10 });
    const monthly = calcTotalMonthlyUnlocks(a, v, S);
    expect(calcPeakMonthlyUnlock(monthly)).toEqual({ month: 0, amount: 300_000 });
  });
});
