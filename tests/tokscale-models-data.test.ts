import assert from "node:assert/strict";
import test from "node:test";

import type {
  TokscaleClientContribution,
  TokscaleContribution,
  TokscaleModelContribution,
} from "../src/lib/tokscale/data.ts";
import {
  buildTokscaleUsageRange,
// @ts-expect-error Node's native TypeScript runner requires the explicit extension.
} from "../src/lib/tokscale/usage.ts";
import {
  buildTokscaleModelUsage,
  formatModelCost,
  formatModelShare,
  formatModelTokens,
// @ts-expect-error Node's native TypeScript runner requires the explicit extension.
} from "../src/lib/tokscale/models.ts";
import {
  getModelColor,
// @ts-expect-error Node's native TypeScript runner requires the explicit extension.
} from "../src/lib/tokscale/modelColors.ts";

const tokenBreakdown = {
  input: 10,
  output: 20,
  cacheRead: 30,
  cacheWrite: 40,
  reasoning: 50,
};

function model(modelId: string, tokens: number, cost: number): TokscaleModelContribution {
  return { ...tokenBreakdown, tokens, cost, messages: 1 };
}

function client(
  name: string,
  models: Record<string, TokscaleModelContribution>,
  cost: number,
): TokscaleClientContribution {
  return {
    client: name,
    modelId: Object.keys(models)[0] ?? "",
    tokens: tokenBreakdown,
    cost,
    messages: 1,
    models,
  };
}

function contribution(date: string, clients: TokscaleClientContribution[]): TokscaleContribution {
  return {
    date,
    intensity: clients.length > 0 ? 1 : 0,
    totals: { tokens: 0, cost: 0, messages: 0 },
    tokenBreakdown,
    clients,
  };
}

test("model usage aggregates every non-synthetic model and sorts by cost with a token tie-break", () => {
  const usage = buildTokscaleModelUsage([
    contribution("2026-08-01", [
      client(
        "codex",
        {
          "gpt-5.6-sol": model("gpt-5.6-sol", 140, 5),
          "deepseek-v4-flash": model("deepseek-v4-flash", 50, 3),
          "gemini-2.5-flash": model("gemini-2.5-flash", 20, 2),
          "kimi-k2": model("kimi-k2", 10, 2),
          "<synthetic>": model("<synthetic>", 999, 99),
        },
        12,
      ),
    ]),
  ]);

  assert.deepEqual(
    usage.map(({ model: modelId }) => modelId),
    ["gpt-5.6-sol", "deepseek-v4-flash", "gemini-2.5-flash", "kimi-k2"],
  );
  assert.deepEqual(
    usage.map(({ tokens, cost }) => ({ tokens, cost })),
    [
      { tokens: 140, cost: 5 },
      { tokens: 50, cost: 3 },
      { tokens: 20, cost: 2 },
      { tokens: 10, cost: 2 },
    ],
  );

  const totalModelCost = 12;
  for (const row of usage) {
    assert.ok(Number.isFinite(row.percentage));
    assert.ok(Math.abs(row.percentage - (row.cost / totalModelCost) * 100) < 1e-9);
  }
});

test("zero-cost model data keeps shares finite at zero", () => {
  const usage = buildTokscaleModelUsage([
    contribution("2026-08-01", [
      client(
        "codex",
        {
          alpha: model("alpha", 10, 0),
          beta: model("beta", 40, 0),
          "<synthetic>": model("<synthetic>", 9_999, 0),
        },
        0,
      ),
    ]),
  ]);

  assert.deepEqual(
    usage.map(({ model: modelId }) => modelId),
    ["beta", "alpha"],
  );
  assert.ok(usage.every((row) => row.percentage === 0 && Number.isFinite(row.percentage)));
});

test("legacy modelId-only clients aggregate from client token breakdown and cost", () => {
  const usage = buildTokscaleModelUsage([
    contribution("2026-08-01", [
      {
        client: "codex",
        modelId: "gpt-5.6-sol",
        tokens: tokenBreakdown,
        cost: 4,
        messages: 2,
        models: {},
      },
    ]),
  ]);

  assert.deepEqual(
    usage.map(({ model: modelId, tokens, cost }) => ({ model: modelId, tokens, cost })),
    [{ model: "gpt-5.6-sol", tokens: 150, cost: 4 }],
  );
  assert.ok(usage[0] && Number.isFinite(usage[0].percentage));
});

test("period windows scope model token/cost/share totals to the selected contribution range", () => {
  const days = [
    contribution("2026-07-25", [
      client("codex", {
        "gpt-5.6-sol": model("gpt-5.6-sol", 100, 2),
        "deepseek-v4-flash": model("deepseek-v4-flash", 50, 1),
      }, 3),
    ]),
    contribution("2026-07-30", [
      client("codex", {
        "gpt-5.6-sol": model("gpt-5.6-sol", 40, 1),
        "kimi-k2": model("kimi-k2", 10, 0.5),
      }, 1.5),
    ]),
    contribution("2026-08-01", [
      client("cli", {
        "gpt-5.6-sol": model("gpt-5.6-sol", 10, 0.5),
      }, 0.5),
    ]),
  ];

  const lifetime = buildTokscaleModelUsage(
    buildTokscaleUsageRange(days, "lifetime").contributions,
  );
  assert.deepEqual(
    lifetime.map(({ model: modelId }) => modelId),
    ["gpt-5.6-sol", "deepseek-v4-flash", "kimi-k2"],
  );
  assert.deepEqual(
    lifetime.map(({ tokens, cost, percentage }) => ({ tokens, cost, percentage })),
    [
      { tokens: 150, cost: 3.5, percentage: 70 },
      { tokens: 50, cost: 1, percentage: 20 },
      { tokens: 10, cost: 0.5, percentage: 10 },
    ],
  );

  const week = buildTokscaleModelUsage(
    buildTokscaleUsageRange(days, "7d").contributions,
  );
  assert.deepEqual(
    week.map(({ model: modelId }) => modelId),
    ["gpt-5.6-sol", "kimi-k2"],
  );
  assert.deepEqual(
    week.map(({ tokens, cost, percentage }) => ({ tokens, cost, percentage })),
    [
      { tokens: 50, cost: 1.5, percentage: 75 },
      { tokens: 10, cost: 0.5, percentage: 25 },
    ],
  );
});

test("formatting matches Tokscale compact token, currency, and one-decimal share semantics", () => {
  assert.equal(formatModelTokens(0), "0");
  assert.equal(formatModelTokens(999), "999");
  assert.equal(formatModelTokens(1_000), "1.0K");
  assert.equal(formatModelTokens(12_345), "12.3K");
  assert.equal(formatModelTokens(999_950), "1.0M");
  assert.equal(formatModelTokens(1_234_567), "1.2M");
  assert.equal(formatModelTokens(1_234_567_890), "1.2B");
  assert.equal(formatModelTokens(1_234_567_890_000), "1.235T");

  assert.equal(formatModelCost(0), "$0.00");
  assert.equal(formatModelCost(8.5), "$8.50");
  assert.equal(formatModelCost(8_813.0126), "$8.81K");
  assert.equal(formatModelCost(1_000_000), "$1.00M");
  assert.equal(formatModelCost(1_234_567.89), "$1.23M");
  assert.equal(formatModelCost(1_200_000_000), "$1.20B");

  assert.equal(formatModelShare(60), "60.0%");
  assert.equal(formatModelShare(33.333), "33.3%");
  assert.equal(formatModelShare(0), "0.0%");
});

test("categorical model colors follow Tokscale's provider mapping", () => {
  assert.equal(getModelColor("gpt-5.6-sol"), "#10B981");
  assert.equal(getModelColor("gpt4"), "#10B981");
  assert.equal(getModelColor("deepseek-v4-flash"), "#06B6D4");
  assert.equal(getModelColor("claude-sonnet-4-6"), "#E39980");
  assert.equal(getModelColor("gemini-2.5-flash"), "#3B82F6");
  assert.equal(getModelColor("unfabled-x"), "#6B7280");
});
