import type { AllocationBucket, VestingConfig } from "./types";
import { calcInitialCircPercent } from "./calc";

/**
 * Market norms for the "vs market" layer on the results screen.
 * Ranges come from the published research compiled on /learn/token-vesting-benchmarks
 * (Liquifi benchmarks via secondary citations, Stephanian & Turley, Binance Research).
 */

export type NormStatus = "within" | "above" | "below";

export interface NormCheck {
  key: string;
  label: string;
  yours: string;
  norm: string;
  status: NormStatus;
}

function status(value: number, min: number, max: number): NormStatus {
  if (value < min) return "below";
  if (value > max) return "above";
  return "within";
}

function pct(allocs: AllocationBucket[], keys: string[]): number {
  const set = new Set(keys);
  return allocs
    .filter((a) => a.enabled && set.has(a.key))
    .reduce((s, a) => s + a.percent, 0);
}

export function compareWithMarket(
  allocs: AllocationBucket[],
  vestings: VestingConfig[],
): NormCheck[] {
  const team = pct(allocs, ["team"]);
  const investors = pct(allocs, ["investors"]);
  const tgeFloat = calcInitialCircPercent(allocs, vestings);
  const teamCfg = vestings.find((v) => v.bucketKey === "team");
  const teamActive = allocs.some((a) => a.key === "team" && a.enabled && a.percent > 0);

  const checks: NormCheck[] = [
    {
      key: "team",
      label: "Team share",
      yours: `${team.toFixed(0)}%`,
      norm: "15-25%",
      status: status(team, 15, 25),
    },
    {
      key: "investors",
      label: "Investor share",
      yours: `${investors.toFixed(0)}%`,
      norm: "10-20%",
      status: status(investors, 10, 20),
    },
    {
      key: "tgeFloat",
      label: "TGE float",
      yours: `${tgeFloat.toFixed(1)}%`,
      norm: "6-20%",
      status: status(tgeFloat, 6, 20),
    },
  ];

  if (teamActive && teamCfg) {
    checks.push({
      key: "teamCliff",
      label: "Team cliff",
      yours: `${teamCfg.cliffMonths}mo`,
      norm: "12mo standard",
      status: status(teamCfg.cliffMonths, 12, 120),
    });
    checks.push({
      key: "teamVesting",
      label: "Team vesting",
      yours: `${teamCfg.vestingMonths}mo`,
      norm: "36-48mo",
      status: status(teamCfg.vestingMonths, 36, 60),
    });
  }
  return checks;
}
