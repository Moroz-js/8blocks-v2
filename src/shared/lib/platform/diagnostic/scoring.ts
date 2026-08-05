import { t } from "../../../i18n";
import { diagnosticContent as content } from "./content";
import type {
  Answers,
  DiagnosticResult,
  PillarKey,
  PillarLevel,
  PillarResult,
  Question,
  Verdict,
  VerdictRule,
} from "./types";

export const QUESTIONS = content.questions as unknown as Question[];
export const VERDICTS = content.verdicts as unknown as Verdict[];
const RULES = content.verdictRules.rules as unknown as VerdictRule[];
const FALLBACK = content.verdictRules.fallbackVerdict as string;
const THRESHOLDS = content.pillarThresholds as {
  maxPerPillar: number;
  strong: number;
  moderate: number;
};

export const PILLARS: { key: PillarKey; label: string }[] = [
  { key: "asset", label: t({ ru: "Готовность актива", en: "Asset readiness" }) },
  { key: "business", label: t({ ru: "Готовность бизнеса", en: "Business readiness" }) },
  { key: "capital", label: t({ ru: "Соответствие капиталу", en: "Capital fit" }) },
  { key: "execution", label: t({ ru: "Готовность к реализации", en: "Execution readiness" }) },
];

export function isComplete(answers: Answers): boolean {
  return QUESTIONS.every((q) => q.options.some((o) => o.id === answers[q.id]));
}

function levelFor(score: number): PillarLevel {
  if (score >= THRESHOLDS.strong) return "strong";
  if (score >= THRESHOLDS.moderate) return "moderate";
  return "weak";
}

export function scorePillars(answers: Answers): PillarResult[] {
  const totals: Record<PillarKey, number> = { asset: 0, business: 0, capital: 0, execution: 0 };
  for (const q of QUESTIONS) {
    const opt = q.options.find((o) => o.id === answers[q.id]);
    if (!opt) continue;
    for (const p of Object.keys(totals) as PillarKey[]) {
      totals[p] += opt.weights[p] ?? 0;
    }
  }
  return PILLARS.map(({ key }) => ({
    key,
    score: totals[key],
    max: THRESHOLDS.maxPerPillar,
    level: levelFor(totals[key]),
  }));
}

function ruleMatches(rule: VerdictRule, answers: Answers): boolean {
  return Object.entries(rule.when).every(([qid, accepted]) =>
    accepted.includes(answers[qid]),
  );
}

/** Plain-language facts from the matched rule: "question title: chosen option label". */
function driversFor(rule: VerdictRule | null, answers: Answers): string[] {
  if (!rule) return [];
  const out: string[] = [];
  for (const qid of Object.keys(rule.when)) {
    const q = QUESTIONS.find((x) => x.id === qid);
    const opt = q?.options.find((o) => o.id === answers[qid]);
    if (q && opt) out.push(`${q.title} — ${opt.label}`);
  }
  return out;
}

export function evaluate(answers: Answers): DiagnosticResult {
  if (!isComplete(answers)) {
    throw new Error("diagnostic: incomplete answers");
  }
  const matched = RULES.find((r) => ruleMatches(r, answers)) ?? null;
  const verdictId = matched ? matched.verdict : FALLBACK;
  const verdict = VERDICTS.find((v) => v.id === verdictId)!;
  return {
    verdict,
    matchedRuleId: matched?.id ?? null,
    drivers: driversFor(matched, answers),
    pillars: scorePillars(answers),
  };
}

/* ── URL state: answers as dot-joined option ids in question order ── */

export function encodeAnswers(answers: Answers): string {
  return QUESTIONS.map((q) => answers[q.id] ?? "").join(".");
}

export function decodeAnswers(encoded: string): Answers | null {
  const parts = encoded.split(".");
  if (parts.length !== QUESTIONS.length) return null;
  const answers: Answers = {};
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    if (!q.options.some((o) => o.id === parts[i])) return null;
    answers[q.id] = parts[i];
  }
  return answers;
}

export const SAMPLE_ANSWERS = {
  assetBacked: content.sample.assetBacked.answers as Answers,
  notYet: content.sample.notYet.answers as Answers,
};
