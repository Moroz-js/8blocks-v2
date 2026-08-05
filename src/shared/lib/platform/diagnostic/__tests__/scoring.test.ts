import { describe, it, expect } from "vitest";
import {
  QUESTIONS, VERDICTS, evaluate, scorePillars, isComplete,
  encodeAnswers, decodeAnswers, SAMPLE_ANSWERS,
} from "../scoring";
import type { Answers } from "../types";

function answersWith(over: Partial<Answers>): Answers {
  // deterministic baseline: first option of every question, overridden per test
  const base: Answers = {};
  for (const q of QUESTIONS) base[q.id] = q.options[0].id;
  for (const [key, value] of Object.entries(over)) {
    if (value !== undefined) base[key] = value;
  }
  return base;
}

describe("content pack integrity", () => {
  it("has 7 questions, 5 verdicts, and every rule references real ids", () => {
    expect(QUESTIONS.length).toBe(7);
    expect(VERDICTS.length).toBe(5);
  });
  it("every option carries all four pillar weights", () => {
    for (const q of QUESTIONS) {
      for (const o of q.options) {
        for (const p of ["asset", "business", "capital", "execution"] as const) {
          expect(o.weights[p]).toBeGreaterThanOrEqual(0);
          expect(o.weights[p]).toBeLessThanOrEqual(3);
        }
      }
    }
  });
});

describe("verdict rules", () => {
  it("sample A (property developer) lands on asset_backed with strong pillars", () => {
    const r = evaluate(SAMPLE_ANSWERS.assetBacked);
    expect(r.verdict.id).toBe("asset_backed");
    expect(r.matchedRuleId).toBe("map_asset_backed");
    expect(r.pillars.map((p) => `${p.key}:${p.score}`)).toEqual([
      "asset:7", "business:8", "capital:8", "execution:7",
    ]);
    expect(r.pillars.every((p) => p.level === "strong")).toBe(true);
  });

  it("sample B (small agency) is forced to not_yet by the small-ticket rule", () => {
    const r = evaluate(SAMPLE_ANSWERS.notYet);
    expect(r.verdict.id).toBe("not_yet");
    expect(r.matchedRuleId).toBe("ny_small_ticket");
    expect(r.verdict.insteadOptions?.length).toBe(3);
    expect(r.drivers.length).toBeGreaterThan(0);
  });

  it("not-yet forcing precedes scenario mapping", () => {
    // property + raise capital would map to asset_backed, but under_500k forces not_yet
    const r = evaluate(answersWith({
      leverage: "property_equipment", goal: "raise_capital", capital_need: "under_500k",
    }));
    expect(r.verdict.id).toBe("not_yet");
  });

  it("receivables + unlock liquidity maps to receivables_inventory", () => {
    const r = evaluate(answersWith({
      leverage: "receivables_invoices", goal: "unlock_liquidity", capital_need: "2m_10m",
    }));
    expect(r.verdict.id).toBe("receivables_inventory");
  });

  it("loyalty goal maps to utility_loyalty regardless of asset", () => {
    const r = evaluate(answersWith({
      leverage: "nothing_specific", goal: "customer_loyalty", revenue: "1m_10m",
    }));
    expect(r.verdict.id).toBe("utility_loyalty");
  });

  it("ambiguous combos fall back to explore_first", () => {
    // recurring revenue + raise capital matches no mapping rule
    const r = evaluate(answersWith({
      leverage: "recurring_revenue", goal: "raise_capital", capital_need: "2m_10m",
    }));
    expect(r.verdict.id).toBe("explore_first");
    expect(r.matchedRuleId).toBeNull();
  });

  it("exploring with no timeline is an honest not_yet", () => {
    const r = evaluate(answersWith({ goal: "just_exploring", timeline: "no_timeline" }));
    expect(r.verdict.id).toBe("not_yet");
  });
});

describe("pillar scoring", () => {
  it("levels follow thresholds strong>=6, moderate>=3", () => {
    const pillars = scorePillars(SAMPLE_ANSWERS.notYet);
    const by = Object.fromEntries(pillars.map((p) => [p.key, p]));
    expect(by.asset.score).toBe(2);
    expect(by.asset.level).toBe("weak");
    expect(by.business.score).toBe(3);
    expect(by.business.level).toBe("moderate");
    expect(by.capital.score).toBe(5);
    expect(by.capital.level).toBe("moderate");
  });
});

describe("url state", () => {
  it("roundtrips answers", () => {
    const encoded = encodeAnswers(SAMPLE_ANSWERS.assetBacked);
    expect(decodeAnswers(encoded)).toEqual(SAMPLE_ANSWERS.assetBacked);
  });
  it("rejects malformed input", () => {
    expect(decodeAnswers("a.b.c")).toBeNull();
    expect(decodeAnswers("x".repeat(50))).toBeNull();
  });
  it("isComplete detects missing answers", () => {
    expect(isComplete(SAMPLE_ANSWERS.assetBacked)).toBe(true);
    expect(isComplete({})).toBe(false);
  });
});
