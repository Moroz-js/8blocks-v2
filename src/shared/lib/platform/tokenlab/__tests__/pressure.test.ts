import { describe, it, expect } from "vitest";
import { calcUnlockPressure12m, getPressureTag } from "../pressure";
import type { AllocationBucket, VestingConfig } from "../types";

const S = 1_000_000;

describe("getPressureTag spec invariants", () => {
  it("Low < 10", () => {
    expect(getPressureTag(0)).toBe("Low");
    expect(getPressureTag(9.99)).toBe("Low");
  });
  it("Moderate 10-25 inclusive", () => {
    expect(getPressureTag(10)).toBe("Moderate");
    expect(getPressureTag(25)).toBe("Moderate");
  });
  it("High > 25", () => {
    expect(getPressureTag(25.01)).toBe("High");
  });
});

describe("calcUnlockPressure12m", () => {
  it("counts months 0 through 12 inclusive", () => {
    // 100% bucket: TGE 10%, no cliff, 20-month vesting -> 4.5%/mo
    const a: AllocationBucket[] = [{ key: "team", percent: 100, enabled: true }];
    const v: VestingConfig[] = [{ bucketKey: "team", tgePercent: 10, cliffMonths: 0, vestingMonths: 20 }];
    // month 0: 10; months 1..12: 12 * 4.5 = 54 -> 64%
    expect(calcUnlockPressure12m(a, v, S)).toBeCloseTo(64, 5);
  });
  it("returns 0 for non-positive supply", () => {
    expect(calcUnlockPressure12m([], [], 0)).toBe(0);
  });
});
