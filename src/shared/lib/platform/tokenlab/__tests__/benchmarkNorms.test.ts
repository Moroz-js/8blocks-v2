import { describe, it, expect } from "vitest";
import { compareWithMarket } from "../benchmarkNorms";
import { createDefaultModel } from "../model";
import type { AllocationBucket, VestingConfig } from "../types";

describe("compareWithMarket", () => {
  it("flags default model correctly against norms", () => {
    const m = createDefaultModel(); // team 20, investors 15, TGE float 6.0
    const checks = compareWithMarket(m.allocations, m.vestings);
    const by = Object.fromEntries(checks.map((c) => [c.key, c]));
    expect(by.team.status).toBe("within"); // 20 in 15-25
    expect(by.investors.status).toBe("within"); // 15 in 10-20
    expect(by.tgeFloat.status).toBe("within"); // 6.0 in 6-20
    expect(by.teamCliff.status).toBe("within"); // 12mo
    expect(by.teamVesting.status).toBe("within"); // 36mo
  });

  it("flags above/below norms", () => {
    const a: AllocationBucket[] = [
      { key: "team", percent: 40, enabled: true },
      { key: "investors", percent: 5, enabled: true },
      { key: "community", percent: 55, enabled: true },
    ];
    const v: VestingConfig[] = [
      { bucketKey: "team", tgePercent: 30, cliffMonths: 0, vestingMonths: 12 },
      { bucketKey: "investors", tgePercent: 0, cliffMonths: 6, vestingMonths: 24 },
      { bucketKey: "community", tgePercent: 40, cliffMonths: 0, vestingMonths: 24 },
    ];
    const by = Object.fromEntries(compareWithMarket(a, v).map((c) => [c.key, c]));
    expect(by.team.status).toBe("above"); // 40 > 25
    expect(by.investors.status).toBe("below"); // 5 < 10
    expect(by.tgeFloat.status).toBe("above"); // 12 + 22 = 34 > 20
    expect(by.teamCliff.status).toBe("below"); // 0 < 12
    expect(by.teamVesting.status).toBe("below"); // 12 < 36
  });

  it("omits team schedule checks when team bucket is disabled", () => {
    const a: AllocationBucket[] = [{ key: "community", percent: 100, enabled: true }];
    const v: VestingConfig[] = [
      { bucketKey: "community", tgePercent: 10, cliffMonths: 0, vestingMonths: 36 },
    ];
    const keys = compareWithMarket(a, v).map((c) => c.key);
    expect(keys).not.toContain("teamCliff");
    expect(keys).not.toContain("teamVesting");
  });
});
