export type PillarKey = "asset" | "business" | "capital" | "execution";

export interface QuestionOption {
  id: string;
  label: string;
  weights: Record<PillarKey, number>;
}

export interface Question {
  id: string;
  title: string;
  help?: string;
  options: QuestionOption[];
}

export interface VerdictPhase {
  name: string;
  duration: string;
}

export interface Verdict {
  id: string;
  name: string;
  forWhom: string;
  summary: string;
  phases: VerdictPhase[];
  firstStep: string;
  watchouts: string[];
  disclaimer: string;
  insteadOptions?: string[];
  recheckWhen?: string[];
}

export interface VerdictRule {
  id: string;
  verdict: string;
  /** question id -> accepted option ids (OR within, AND across keys) */
  when: Record<string, string[]>;
}

/** answers: question id -> chosen option id */
export type Answers = Record<string, string>;

export type PillarLevel = "strong" | "moderate" | "weak";

export interface PillarResult {
  key: PillarKey;
  score: number;
  max: number;
  level: PillarLevel;
}

export interface DiagnosticResult {
  verdict: Verdict;
  matchedRuleId: string | null;
  /** plain-language facts that drove the verdict (from the matched rule's conditions) */
  drivers: string[];
  pillars: PillarResult[];
}
