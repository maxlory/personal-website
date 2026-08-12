import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { updateTokscaleSnapshot } from "../scripts/update-tokscale-snapshot.mjs";
import { parseTokscaleSnapshot } from "../src/lib/tokscale/validate.mjs";

const validPayload = {
  stats: {
    totalTokens: 150,
    totalCost: 0.42,
    activeDays: 1,
    submissionCount: 2,
  },
  updatedAt: "2026-08-12T01:20:01.843Z",
  contributions: [
    {
      date: "2026-08-11",
      intensity: 1,
      totals: { tokens: 150, cost: 0.42, messages: 2 },
      tokenBreakdown: {
        input: 50,
        output: 30,
        cacheRead: 40,
        cacheWrite: 20,
        reasoning: 10,
      },
      clients: [
        {
          client: "codex",
          modelId: "gpt-5.6-sol",
          providerId: "openai",
          tokens: {
            input: 50,
            output: 30,
            cacheRead: 40,
            cacheWrite: 20,
            reasoning: 10,
          },
          cost: 0.42,
          messages: 2,
          models: {},
        },
      ],
    },
  ],
};

async function withSnapshotPath(
  run: (snapshotPath: string) => Promise<void>,
): Promise<void> {
  const directory = await mkdtemp(path.join(tmpdir(), "tokscale-snapshot-"));
  const snapshotPath = path.join(directory, "tokscale.json");
  try {
    await run(snapshotPath);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("a malformed upstream candidate never overwrites the existing snapshot", async () => {
  await withSnapshotPath(async (snapshotPath) => {
    const existing = '{"preserve":"last successful snapshot"}\n';
    await writeFile(snapshotPath, existing, "utf8");

    await assert.rejects(() =>
      updateTokscaleSnapshot({
        snapshotPath,
        fetcher: async () =>
          Response.json({
            ...validPayload,
            contributions: [{ totals: { tokens: 1 } }],
          }),
      }),
    );

    assert.equal(await readFile(snapshotPath, "utf8"), existing);
  });
});

test("the updater atomically writes only a validated snapshot", async () => {
  await withSnapshotPath(async (snapshotPath) => {
    await updateTokscaleSnapshot({
      snapshotPath,
      fetcher: async () => Response.json(validPayload),
    });

    const serialized = await readFile(snapshotPath, "utf8");
    assert.equal(serialized.endsWith("\n"), true);
    const snapshot = parseTokscaleSnapshot(JSON.parse(serialized));
    assert.equal(snapshot.schemaVersion, 1);
    assert.equal(snapshot.source, "https://tokscale.ai/api/users/maxlory");
    assert.equal(snapshot.data.totalTokens, 150);
    assert.equal(snapshot.data.contributions[0]?.date, "2026-08-11");
  });
});

test("unchanged validated upstream data does not rewrite the snapshot", async () => {
  await withSnapshotPath(async (snapshotPath) => {
    await updateTokscaleSnapshot({
      snapshotPath,
      fetcher: async () => Response.json(validPayload),
    });
    const existing = await readFile(snapshotPath, "utf8");

    await updateTokscaleSnapshot({
      snapshotPath,
      fetcher: async () => Response.json(validPayload),
    });

    assert.equal(await readFile(snapshotPath, "utf8"), existing);
  });
});

test("weekly workflow supports manual runs and commits only a changed snapshot", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/tokscale-weekly.yml", import.meta.url),
    "utf8",
  );

  assert.match(workflow, /schedule:/);
  assert.match(workflow, /cron:\s*["']\d+\s+\d+\s+\*\s+\*\s+\d["']/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /node scripts\/update-tokscale-snapshot\.mjs/);
  assert.match(
    workflow,
    /git diff --quiet -- src\/lib\/tokscale\/snapshot\.json/,
  );
  assert.match(workflow, /git commit/);
});
