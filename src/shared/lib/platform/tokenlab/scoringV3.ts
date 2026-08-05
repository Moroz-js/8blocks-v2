import type { AllocationBucket, StandardBucketKey, VestingConfig } from "./types";

/**
 * Structure Score v3 (0-100) — designed by an expert-panel synthesis (July 2026)
 * from published evidence: Binance Research (low float / high FDV), Keyrock
 * (16,000+ unlock events), Animoca (best band 0.4-0.6 MC/FDV at listing),
 * Presto Research (FDV overhang), a16z (insider lockup rules), Pantera/
 * Stephanian (vesting shape), Messari (insider share vs performance).
 * Full spec: docs/research/scoring-spec-2026-07.json.
 *
 * Measures structural sell-pressure risk only. Archetype-aware: a fair launch
 * and a VC launch have different correct answers. Deterministic, structure-only.
 */

export type ArchetypeId =
  | "full_float"
  | "community_launch"
  | "vc_backed"
  | "ecosystem_led"
  | "balanced";

export interface DimensionResult {
  id: "community" | "float" | "overhang" | "discipline" | "shock";
  name: string;
  score: number;
  weight: number;
  oneLiner: string;
}

export interface CapNotice {
  id: "capA" | "capB";
  message: string;
}

export interface TopFix {
  label: string;
  gain: number;
}

export interface TierInfo {
  name: string;
  range: string;
  meaning: string;
}

export interface StructureScore {
  score: number;
  tier: TierInfo;
  archetype: { id: ArchetypeId; label: string; explain: string };
  dimensions: DimensionResult[];
  caps: CapNotice[];
  topFixes: TopFix[];
}

export const TIERS: TierInfo[] = [
  { name: "Rock Solid", range: "85-100", meaning: "The supply schedule is a tailwind. The token can still fail, but its tokenomics will not be the reason." },
  { name: "Strong", range: "70-84", meaning: "Fundamentally sound, with one or two visible pressure points that follow professional norms." },
  { name: "Watch List", range: "55-69", meaning: "Workable, but real structural pressure sits next to real strengths. Apply the top fixes before TGE." },
  { name: "Fragile", range: "40-54", meaning: "The structure will actively fight the token: expect sustained dilution pressure or unlock-driven selloffs." },
  { name: "Red Flag", range: "0-39", meaning: "This shape has preceded severe price damage across hundreds of launches. Do not launch this as-is." },
];

const ARCHETYPE_LABELS: Record<ArchetypeId, { label: string; explain: string }> = {
  full_float: { label: "Full Float", explain: "Nearly everything is tradable on day one - no overhang, but no long-term skin in the game either." },
  community_launch: { label: "Community Launch", explain: "No meaningful investor allocation and a community-weighted supply - scored by fair-launch norms, where a large community float is healthy." },
  vc_backed: { label: "VC-Backed Launch", explain: "Meaningful investor allocation - scored by professional venture norms: 12-month insider cliffs and multi-year schedules." },
  ecosystem_led: { label: "Ecosystem-Led", explain: "Supply concentrated in ecosystem, treasury and foundation programs - scored with program-emission norms." },
  balanced: { label: "Balanced", explain: "A mixed structure - scored by the base professional norms." },
};

const DIMENSION_META: Record<DimensionResult["id"], { name: string; weight: number; oneLiner: string }> = {
  community: { name: "Community Allocation", weight: 20, oneLiner: "How much of the supply goes to users and community instead of insiders." },
  float: { name: "Day-One Float", weight: 15, oneLiner: "How much supply is really tradable at launch - too little guarantees years of dilution; the mid-range is healthiest." },
  overhang: { name: "Supply Overhang", weight: 25, oneLiner: "How much locked supply still hangs over the market compared to the day-one float, and how fast the float doubles." },
  discipline: { name: "Insider Lock Discipline", weight: 25, oneLiner: "Whether team and investor tokens are locked long enough, with a real cliff and nothing liquid on day one." },
  shock: { name: "Unlock Shock", weight: 15, oneLiner: "Whether future supply arrives gradually or in damaging one-month cliffs, weighted by who receives it." },
};

/** Keyrock-derived recipient severity weights: who receives an unlock matters. */
const SEVERITY: Record<StandardBucketKey, number> = {
  team: 1.0,
  investors: 0.85,
  foundation: 0.6,
  treasury: 0.45,
  publicSale: 0.4,
  liquidity: 0.2,
  ecosystem: 0.2,
  community: 0.15,
};

/** Piecewise-linear interpolation through points, clamped flat outside endpoints. */
function pl(points: [number, number][], x: number): number {
  if (x <= points[0][0]) return points[0][1];
  const last = points[points.length - 1];
  if (x >= last[0]) return last[1];
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    if (x <= x2) return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
  }
  return last[1];
}

const clamp = (v: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, v));

interface Prep {
  A: Record<StandardBucketKey, number>;
  T: Record<StandardBucketKey, number>;
  C: Record<StandardBucketKey, number>;
  tgeUnlock: Record<StandardBucketKey, number>;
  locked: Record<StandardBucketKey, number>;
  /** u[b][m]: % of total supply unlocking to bucket b in month m (1..M) */
  u: Record<StandardBucketKey, number[]>;
  circ: number[];
  F0: number;
  insiderLiquid0: number;
  M: number;
  active: StandardBucketKey[];
}

const KEYS: StandardBucketKey[] = [
  "team", "investors", "community", "ecosystem", "treasury", "liquidity", "foundation", "publicSale",
];

function prepare(allocs: AllocationBucket[], vestings: VestingConfig[]): Prep {
  const A = {} as Prep["A"];
  const T = {} as Prep["T"];
  const C = {} as Prep["C"];
  const V = {} as Record<StandardBucketKey, number>;
  for (const k of KEYS) {
    const a = allocs.find((x) => x.key === k);
    const v = vestings.find((x) => x.bucketKey === k);
    A[k] = a && a.enabled ? a.percent : 0;
    T[k] = v?.tgePercent ?? 0;
    C[k] = v?.cliffMonths ?? 0;
    V[k] = v?.vestingMonths ?? 0;
  }
  const active = KEYS.filter((k) => A[k] > 0);
  let maxEnd = 0;
  for (const k of active) maxEnd = Math.max(maxEnd, C[k] + V[k]);
  const M = Math.min(120, Math.max(60, maxEnd + 1));

  const tgeUnlock = {} as Prep["tgeUnlock"];
  const locked = {} as Prep["locked"];
  const u = {} as Prep["u"];
  for (const k of KEYS) {
    tgeUnlock[k] = (A[k] * T[k]) / 100;
    locked[k] = A[k] - tgeUnlock[k];
    const arr = new Array<number>(M + 1).fill(0);
    if (A[k] > 0 && locked[k] > 0) {
      if (V[k] > 0) {
        const per = locked[k] / V[k];
        for (let m = C[k] + 1; m <= Math.min(C[k] + V[k], M); m++) arr[m] += per;
      } else {
        const m = Math.max(C[k], 1);
        if (m <= M) arr[m] += locked[k];
      }
    }
    u[k] = arr;
  }
  const F0 = KEYS.reduce((s, k) => s + tgeUnlock[k], 0);
  const circ = new Array<number>(M + 1).fill(0);
  circ[0] = F0;
  for (let m = 1; m <= M; m++) {
    circ[m] = circ[m - 1] + KEYS.reduce((s, k) => s + u[k][m], 0);
  }
  return { A, T, C, tgeUnlock, locked, u, circ, F0, insiderLiquid0: tgeUnlock.team + tgeUnlock.investors, M, active };
}

function detectArchetype(p: Prep): ArchetypeId {
  const { A, F0 } = p;
  if (F0 >= 90) return "full_float";
  if (A.investors <= 1 && A.community + A.ecosystem + A.publicSale >= 40 && A.team <= 30) {
    return "community_launch";
  }
  if (A.investors >= 10 || (A.investors >= 5 && A.team + A.investors >= 25)) return "vc_backed";
  if (A.ecosystem + A.treasury + A.foundation >= 45) return "ecosystem_led";
  return "balanced";
}

function d1Community(p: Prep, arch: ArchetypeId, vestings: VestingConfig[]): number {
  const found = vestings.find((v) => v.bucketKey === "foundation");
  const foundLong = (found?.cliffMonths ?? 0) + (found?.vestingMonths ?? 0) >= 36;
  const fW = arch === "ecosystem_led" && foundLong ? 0.25 : 0.5;
  const INS = p.A.team + p.A.investors + fW * p.A.foundation;
  const insiderScore = pl([[20, 100], [35, 65], [50, 25], [70, 0]], INS);
  const CS = p.A.community + p.A.publicSale + p.A.ecosystem + Math.min(0.5 * p.A.treasury, 20);
  const communityScore = pl([[0, 0], [15, 25], [40, 80], [60, 100]], CS);
  return clamp(0.5 * insiderScore + 0.5 * communityScore);
}

function d2Float(p: Prep, arch: ArchetypeId): number {
  let base: number;
  if (arch === "full_float") base = 100;
  else if (arch === "community_launch") {
    base = pl([[0, 0], [5, 15], [15, 55], [25, 100], [70, 100], [100, 80]], p.F0);
  } else {
    base = pl([[0, 0], [5, 15], [15, 50], [30, 100], [60, 100], [80, 75], [100, 60]], p.F0);
  }
  const compositionPenalty = Math.min(45, 6 * p.insiderLiquid0);
  return clamp(base - compositionPenalty);
}

function d3Overhang(p: Prep, arch: ArchetypeId): number {
  if (arch === "full_float") return 100;
  const lockedWeighted = KEYS.reduce((s, k) => s + p.locked[k] * SEVERITY[k], 0);
  const WOR = lockedWeighted / Math.max(p.F0, 1);
  const subA = pl([[0.5, 100], [1.5, 78], [3.5, 50], [7, 12], [12, 0]], WOR);
  let ttd = Infinity;
  if (p.F0 < 50) {
    for (let m = 1; m <= p.M; m++) {
      if (p.circ[m] >= 2 * p.F0) {
        ttd = m;
        break;
      }
    }
  }
  let subB: number;
  if (!Number.isFinite(ttd) || ttd >= 36) subB = 100;
  else if (arch === "ecosystem_led") {
    subB = pl([[0, 0], [4.5, 15], [9, 45], [18, 78], [27, 100]], ttd);
  } else {
    subB = pl([[0, 0], [6, 15], [12, 45], [24, 78], [36, 100]], ttd);
  }
  return clamp(0.5 * subA + 0.5 * subB);
}

function d4Discipline(p: Prep, arch: ArchetypeId, vestings: VestingConfig[]): number {
  if (arch === "full_float") return 35;
  const insiders = (["team", "investors"] as StandardBucketKey[]).filter((k) => p.A[k] > 0);
  if (insiders.length === 0) return 60;
  let num = 0;
  let den = 0;
  for (const k of insiders) {
    const v = vestings.find((x) => x.bucketKey === k)!;
    const tgePts = pl([[0, 30], [5, 15], [10, 5], [15, 0]], v.tgePercent);
    const cliffPts = pl([[0, 0], [6, 15], [12, 30]], v.cliffMonths);
    const TL = v.cliffMonths + v.vestingMonths;
    const durPts = pl([[0, 0], [12, 10], [24, 28], [36, 40], [48, 40], [72, 32]], TL);
    let s = tgePts + cliffPts + durPts;
    if (v.vestingMonths === 0 && p.locked[k] > 0) s *= 0.5;
    num += p.A[k] * s;
    den += p.A[k];
  }
  return clamp(num / den);
}

function d5Shock(p: Prep, arch: ArchetypeId): number {
  if (arch === "full_float") return 100;
  let anyUnlock = false;
  let maxShock = 0;
  for (let m = 1; m <= p.M; m++) {
    const sev = KEYS.reduce((s, k) => s + p.u[k][m] * SEVERITY[k], 0);
    if (sev > 0) anyUnlock = true;
    const shock = sev / Math.max(p.circ[m - 1], 1);
    if (shock > maxShock) maxShock = shock;
  }
  if (!anyUnlock) return 100;
  const shockScore = pl([[0.03, 100], [0.1, 55], [0.25, 20], [0.5, 5], [1.0, 0]], maxShock);
  let y1i = 0;
  for (let m = 1; m <= Math.min(12, p.M); m++) y1i += p.u.team[m] + p.u.investors[m];
  const y1Score = pl([[0, 100], [5, 60], [10, 30], [20, 0]], y1i);
  return clamp(0.7 * shockScore + 0.3 * y1Score);
}

function tierFor(score: number): TierInfo {
  if (score >= 85) return TIERS[0];
  if (score >= 70) return TIERS[1];
  if (score >= 55) return TIERS[2];
  if (score >= 40) return TIERS[3];
  return TIERS[4];
}

function computeCore(
  allocs: AllocationBucket[],
  vestings: VestingConfig[],
): Omit<StructureScore, "topFixes"> {
  const p = prepare(allocs, vestings);
  const arch = detectArchetype(p);
  const d1 = d1Community(p, arch, vestings);
  const d2 = d2Float(p, arch);
  const d3 = d3Overhang(p, arch);
  const d4 = d4Discipline(p, arch, vestings);
  const d5 = d5Shock(p, arch);
  let score = Math.round(0.2 * d1 + 0.15 * d2 + 0.25 * d3 + 0.25 * d4 + 0.15 * d5);

  const caps: CapNotice[] = [];
  const CSraw = p.A.community + p.A.publicSale + p.A.ecosystem + Math.min(0.5 * p.A.treasury, 20);
  if (CSraw < 15) {
    score = Math.min(score, 44);
    caps.push({
      id: "capA",
      message:
        "Almost nothing reaches the public. Structures like this (Internet Computer: ~1.5% to community at launch, down 99%+ from peak) have ended in collapse.",
    });
  }
  if (p.insiderLiquid0 >= 10) {
    score = Math.min(score, 49);
    caps.push({
      id: "capB",
      message: "Over 10% of total supply is liquid to team and investors on day one.",
    });
  }

  const dims: DimensionResult[] = (
    [
      ["community", d1],
      ["float", d2],
      ["overhang", d3],
      ["discipline", d4],
      ["shock", d5],
    ] as [DimensionResult["id"], number][]
  ).map(([id, s]) => ({ id, score: Math.round(s), ...DIMENSION_META[id] }));

  return {
    score: clamp(score),
    tier: tierFor(clamp(score)),
    archetype: { id: arch, ...ARCHETYPE_LABELS[arch] },
    dimensions: dims,
    caps,
  };
}

interface FixCandidate {
  label: string;
  apply: (v: VestingConfig[], a: AllocationBucket[]) => { v: VestingConfig[]; a: AllocationBucket[] } | null;
}

function fixCandidates(p: Prep): FixCandidate[] {
  const out: FixCandidate[] = [];
  for (const k of ["team", "investors"] as StandardBucketKey[]) {
    if (p.A[k] <= 0) continue;
    const label = k === "team" ? "team" : "investor";
    out.push({
      label: `Add a 12-month cliff to the ${label} bucket`,
      apply: (v, a) => {
        const cfg = v.find((x) => x.bucketKey === k)!;
        if (cfg.cliffMonths >= 12) return null;
        return { a, v: v.map((x) => (x.bucketKey === k ? { ...x, cliffMonths: 12 } : x)) };
      },
    });
    out.push({
      label: `Extend ${label} vesting to 36 months total`,
      apply: (v, a) => {
        const cfg = v.find((x) => x.bucketKey === k)!;
        if (cfg.cliffMonths + cfg.vestingMonths >= 36) return null;
        return {
          a,
          v: v.map((x) =>
            x.bucketKey === k ? { ...x, vestingMonths: Math.max(36 - x.cliffMonths, 24) } : x,
          ),
        };
      },
    });
    out.push({
      label: `Remove the ${label} TGE unlock`,
      apply: (v, a) => {
        const cfg = v.find((x) => x.bucketKey === k)!;
        if (cfg.tgePercent <= 0) return null;
        return { a, v: v.map((x) => (x.bucketKey === k ? { ...x, tgePercent: 0 } : x)) };
      },
    });
  }
  if (p.F0 < 15 && p.A.community > 0) {
    out.push({
      label: "Raise the community TGE unlock so ~15% of supply is tradable at launch",
      apply: (v, a) => {
        const need = 15 - p.F0;
        const t = Math.min(100, ((p.tgeUnlock.community + need) / p.A.community) * 100);
        return { a, v: v.map((x) => (x.bucketKey === "community" ? { ...x, tgePercent: t } : x)) };
      },
    });
  }
  return out;
}

/** Full result including "top fixes" ranked by recomputed point gain. */
export function computeStructureScore(
  allocs: AllocationBucket[],
  vestings: VestingConfig[],
): StructureScore {
  const core = computeCore(allocs, vestings);
  const p = prepare(allocs, vestings);
  const fixes: TopFix[] = [];
  for (const c of fixCandidates(p)) {
    const applied = c.apply(vestings, allocs);
    if (!applied) continue;
    const next = computeCore(applied.a, applied.v);
    const gain = next.score - core.score;
    if (gain >= 2) fixes.push({ label: c.label, gain });
  }
  fixes.sort((a, b) => b.gain - a.gain);
  return { ...core, topFixes: fixes.slice(0, 3) };
}

/** Letter mapping kept ONLY for the legacy PDF template. */
export function tierToLetter(score: number): "A" | "B" | "C" | "D" {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  return "D";
}
