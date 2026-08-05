export type StandardBucketKey =
  | "team"
  | "investors"
  | "community"
  | "ecosystem"
  | "treasury"
  | "liquidity"
  | "foundation"
  | "publicSale";

export interface AllocationBucket {
  key: StandardBucketKey;
  percent: number;
  enabled: boolean;
}

export interface VestingConfig {
  bucketKey: StandardBucketKey;
  tgePercent: number;
  cliffMonths: number;
  vestingMonths: number;
}

export type MetricStatus = "Good" | "Medium" | "Weak";
export type SubCheckStatus = "Strong" | "Mixed" | "Weak";
export type OverallGrade = "A" | "B" | "C" | "D";

export interface MetricResult {
  key: string;
  label: string;
  status: MetricStatus;
  value: number | string;
  strength: string | null;
  risk: string | null;
}

export interface SubCheck {
  name: string;
  status: SubCheckStatus;
  metrics: MetricResult[];
  strengths: string[];
  risks: string[];
}

export interface ScoringResult {
  grade: OverallGrade;
  interpretation: string;
  subChecks: {
    allocationBalance: SubCheck;
    insiderPressure: SubCheck;
    tgeReadiness: SubCheck;
    vestingSustainability: SubCheck;
  };
  strengths: string[];
  risks: string[];
}
