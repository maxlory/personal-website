import assert from "node:assert/strict";
import test from "node:test";

import type { TokscaleContribution } from "../src/lib/tokscale/data.ts";
import {
  buildTokscaleContributionCalendar,
  buildTokscaleUsageRange,
  getTokscaleDayBreakdown,
// @ts-expect-error Node's native TypeScript runner requires the explicit extension.
} from "../src/lib/tokscale/usage.ts";

const tokenBreakdown = {
  input: 10,
  output: 20,
  cacheRead: 30,
  cacheWrite: 40,
  reasoning: 50,
};

function contribution(
  date: string,
  tokens: number,
  clients: TokscaleContribution["clients"] = [],
): TokscaleContribution {
  return {
    date,
    intensity: tokens > 0 ? 1 : 0,
    totals: { tokens, cost: tokens / 100, messages: 0 },
    tokenBreakdown,
    clients,
  };
}

const contributions = [
  contribution("2026-01-01", 100),
  contribution("2026-01-02", 200),
  contribution("2026-01-03", 300),
  contribution("2026-01-30", 400),
  contribution("2026-01-31", 500),
];

test("periods are inclusive windows anchored to the latest contribution date", () => {
  assert.deepEqual(buildTokscaleUsageRange(contributions, "lifetime"), {
    period: "lifetime",
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    activeDays: 5,
    totalTokens: 1_500,
    totalCost: 15,
    selectedDate: "2026-01-31",
    contributions,
  });

  const thirtyDays = buildTokscaleUsageRange(contributions, "30d");
  assert.equal(thirtyDays.startDate, "2026-01-02");
  assert.equal(thirtyDays.endDate, "2026-01-31");
  assert.deepEqual(
    thirtyDays.contributions.map(({ date }) => date),
    ["2026-01-02", "2026-01-03", "2026-01-30", "2026-01-31"],
  );
  assert.equal(thirtyDays.activeDays, 4);
  assert.equal(thirtyDays.totalTokens, 1_400);

  const sevenDays = buildTokscaleUsageRange(contributions, "7d");
  assert.equal(sevenDays.startDate, "2026-01-25");
  assert.equal(sevenDays.endDate, "2026-01-31");
  assert.deepEqual(
    sevenDays.contributions.map(({ date }) => date),
    ["2026-01-30", "2026-01-31"],
  );
  assert.equal(sevenDays.selectedDate, "2026-01-31");
});

test("day breakdown preserves every token category and complete client/model details", () => {
  const day = contribution("2026-01-31", 150, [
    {
      client: "codex",
      modelId: "",
      tokens: tokenBreakdown,
      cost: 3,
      messages: 7,
      models: {
        "gpt-5.6-sol": {
          ...tokenBreakdown,
          tokens: 150,
          cost: 2,
          messages: 5,
        },
        "deepseek-v4-flash": {
          input: 1,
          output: 2,
          cacheRead: 3,
          cacheWrite: 4,
          reasoning: 5,
          tokens: 15,
          cost: 1,
          messages: 2,
        },
      },
    },
  ]);

  const breakdown = getTokscaleDayBreakdown(day);

  assert.deepEqual(breakdown.tokenCategories, [
    { label: "Input", value: 10 },
    { label: "Output", value: 20 },
    { label: "Cache read", value: 30 },
    { label: "Cache write", value: 40 },
    { label: "Reasoning", value: 50 },
  ]);
  assert.equal(breakdown.messages, 7);
  assert.deepEqual(
    breakdown.clients.map((client) => ({
      client: client.client,
      models: client.models.map((model) => model.modelId),
    })),
    [
      {
        client: "codex",
        models: ["gpt-5.6-sol", "deepseek-v4-flash"],
      },
    ],
  );
  assert.deepEqual(breakdown.clients[0]?.models[1], {
    modelId: "deepseek-v4-flash",
    totalTokens: 15,
    cost: 1,
    messages: 2,
  });
});

test("day breakdown synthesizes a model row from client modelId when nested models are empty", () => {
  const day = contribution("2026-01-31", 150, [
    {
      client: "codex",
      modelId: "gpt-5.6-sol",
      tokens: tokenBreakdown,
      cost: 3,
      messages: 7,
      models: {},
    },
  ]);

  const breakdown = getTokscaleDayBreakdown(day);
  assert.deepEqual(breakdown.clients[0]?.models, [
    { modelId: "gpt-5.6-sol", totalTokens: 150, cost: 3, messages: 7 },
  ]);
  assert.equal(breakdown.clients[0]?.cost, 3);
  assert.equal(breakdown.clients[0]?.messages, 7);
});

test("an empty period is explicit and never fabricates a selected day", () => {
  assert.deepEqual(buildTokscaleUsageRange([], "7d"), {
    period: "7d",
    startDate: null,
    endDate: null,
    activeDays: 0,
    totalTokens: 0,
    totalCost: 0,
    selectedDate: null,
    contributions: [],
  });
});

test("contribution calendar always spans the latest 12 months for lifetime with week-aligned cells", () => {
  const lifetime = buildTokscaleContributionCalendar(
    buildTokscaleUsageRange(
      [
        contribution("2026-01-01", 100),
        contribution("2026-01-02", 200),
        contribution("2026-01-03", 300),
        contribution("2026-01-04", 400),
        contribution("2026-01-05", 500),
      ],
      "lifetime",
    ),
  );

  assert.equal(lifetime.weekCount, 53);
  assert.equal(lifetime.cells.length, 53 * 7);
  assert.equal(lifetime.displayStartDate, "2025-01-06");
  assert.equal(lifetime.displayEndDate, "2026-01-05");
  const inRange = lifetime.cells.filter((cell) => cell.inRange);
  assert.equal(inRange.length, 365);
  assert.equal(inRange[0]?.date, "2025-01-06");
  assert.equal(inRange.at(-1)?.date, "2026-01-05");
  assert.equal(lifetime.cells[0]?.date, "2025-01-05");
  assert.equal(lifetime.cells[0]?.inRange, false);
  assert.ok(lifetime.monthMarkers.length >= 12);
  assert.equal(lifetime.monthMarkers[0]?.label, "Jan");
  assert.equal(lifetime.monthMarkers[0]?.weekIndex, 0);
  assert.equal(lifetime.monthMarkers[0]?.compactVisible, true);
});

test("contribution calendar keeps short 7d windows compact and week-aligned", () => {
  const week = buildTokscaleContributionCalendar(
    buildTokscaleUsageRange(
      [
        contribution("2026-01-01", 100),
        contribution("2026-01-02", 200),
        contribution("2026-01-03", 300),
        contribution("2026-01-04", 400),
        contribution("2026-01-05", 500),
        contribution("2026-01-06", 600),
        contribution("2026-01-07", 700),
      ],
      "7d",
    ),
  );

  assert.equal(week.weekCount, 2);
  assert.equal(week.displayStartDate, "2026-01-01");
  assert.equal(week.displayEndDate, "2026-01-07");
  assert.equal(week.cells[0]?.date, "2025-12-28");
  const inRange = week.cells.filter((cell) => cell.inRange);
  assert.equal(inRange.length, 7);
  assert.equal(inRange[0]?.date, "2026-01-01");
  assert.equal(inRange.at(-1)?.date, "2026-01-07");
});
