import assert from "node:assert/strict";
import test from "node:test";

import {
  TOKSCALE_REQUEST_TIMEOUT_MS,
  fetchTokscaleSummary,
  getTokscaleUsageData,
  parseTokscaleUsageData,
  parseTokscaleSummary,
// @ts-expect-error Node's native TypeScript runner requires the explicit extension.
} from "../src/lib/tokscale/data.ts";

const completePayload = {
  stats: {
    totalTokens: 11_561_774_690,
    totalCost: 8_813.0126,
    activeDays: 89,
    submissionCount: 8,
  },
  updatedAt: "2026-08-12T01:20:01.843Z",
};

const legacyContribution = {
  date: "2026-08-11",
  intensity: 1,
  totals: { tokens: 10, cost: 0.1, messages: 1 },
  tokenBreakdown: { input: 5, output: 5, cacheRead: 0, cacheWrite: 0, reasoning: 0 },
  clients: [
    {
      client: "codex",
      modelId: "gpt-5.6-sol",
      tokens: { input: 5, output: 5, cacheRead: 0, cacheWrite: 0, reasoning: 0 },
      cost: 0.1,
      messages: 1,
    },
  ],
};

function usagePayloadWith(date: string) {
  return {
    ...completePayload,
    contributions: [{ ...legacyContribution, date }],
  };
}

test("summary parser accepts only the complete finite Tokscale payload", () => {
  assert.deepEqual(parseTokscaleSummary(completePayload), {
    totalTokens: 11_561_774_690,
    totalCost: 8_813.0126,
    activeDays: 89,
    submissionCount: 8,
    updatedAt: "2026-08-12T01:20:01.843Z",
  });

  for (const invalid of [
    "<!doctype html><title>upstream error</title>",
    { error: "temporarily unavailable" },
    { stats: { totalTokens: 1 }, updatedAt: completePayload.updatedAt },
    {
      ...completePayload,
      stats: { ...completePayload.stats, totalCost: Number.NaN },
    },
  ]) {
    assert.throws(() => parseTokscaleSummary(invalid));
  }
});

test("explicit server fetch helper uses a finite abort timeout without cache promises", async () => {
  assert.ok(Number.isFinite(TOKSCALE_REQUEST_TIMEOUT_MS));
  assert.ok(TOKSCALE_REQUEST_TIMEOUT_MS > 0);

  let observedInit: RequestInit = {};
  const fakeFetch: typeof fetch = async (_input, init) => {
    observedInit = init ?? {};
    return Response.json(completePayload);
  };

  await fetchTokscaleSummary(fakeFetch);

  assert.equal(observedInit.next, undefined);
  assert.ok(observedInit.signal instanceof AbortSignal);
});

test("server fetch rejects HTTP errors and non-JSON responses", async () => {
  await assert.rejects(() =>
    fetchTokscaleSummary(async () => new Response("bad gateway", { status: 502 })),
  );
  await assert.rejects(() =>
    fetchTokscaleSummary(
      async () =>
        new Response("<html>maintenance</html>", {
          headers: { "content-type": "text/html" },
        }),
    ),
  );
});

test("production usage data reads a validated repository snapshot without network", async () => {
  const originalFetch = globalThis.fetch;
  let networkCalls = 0;
  globalThis.fetch = async () => {
    networkCalls += 1;
    throw new Error("production data loader must not use the network");
  };

  try {
    const data = await getTokscaleUsageData();
    assert.ok(data);
    assert.ok(data.updatedAt.length > 0);
    assert.ok(data.contributions.length > 0);
    assert.equal(networkCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("legacy client payloads without nested models parse with an empty models map", () => {
  const parsed = parseTokscaleUsageData(usagePayloadWith("2026-08-11"));
  assert.deepEqual(parsed.contributions[0]?.clients[0]?.models, {});
  assert.equal(parsed.contributions[0]?.clients[0]?.modelId, "gpt-5.6-sol");
  assert.equal(parsed.contributions[0]?.clients[0]?.cost, 0.1);
});

test("invalid calendar dates are rejected strictly", () => {
  for (const date of [
    "2026-02-30",
    "2026-13-01",
    "2026-00-10",
    "2026-01-32",
  ]) {
    assert.throws(() => parseTokscaleUsageData(usagePayloadWith(date)));
  }

  const parsed = parseTokscaleUsageData(usagePayloadWith("2026-02-28"));
  assert.equal(parsed.contributions[0]?.date, "2026-02-28");
});
