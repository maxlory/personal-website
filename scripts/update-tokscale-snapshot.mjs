#!/usr/bin/env node

import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createTokscaleSnapshot, parseTokscaleSnapshot, TOKSCALE_SOURCE_URL } from "../src/lib/tokscale/validate.mjs";

export const TOKSCALE_UPDATE_TIMEOUT_MS = 15_000;
const defaultPath = fileURLToPath(new URL("../src/lib/tokscale/snapshot.json", import.meta.url));

export async function updateTokscaleSnapshot({ snapshotPath = defaultPath, fetcher = fetch } = {}) {
  const response = await fetcher(TOKSCALE_SOURCE_URL, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(TOKSCALE_UPDATE_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Tokscale request failed with ${response.status}`);
  if (!(response.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) {
    throw new Error("Tokscale returned a non-JSON response");
  }

  const snapshot = createTokscaleSnapshot(await response.json());
  parseTokscaleSnapshot(snapshot);
  const directory = path.dirname(snapshotPath);
  const existing = await readFile(snapshotPath, "utf8").catch(() => null);
  if (existing !== null) {
    const existingSnapshot = JSON.parse(existing);
    parseTokscaleSnapshot(existingSnapshot);
    if (JSON.stringify(existingSnapshot.payload) === JSON.stringify(snapshot.payload)) {
      return parseTokscaleSnapshot(existingSnapshot);
    }
  }
  const temporaryPath = path.join(directory, `.${path.basename(snapshotPath)}.${process.pid}.${Date.now()}.tmp`);
  await mkdir(directory, { recursive: true });
  try {
    await writeFile(temporaryPath, `${JSON.stringify(snapshot, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
    parseTokscaleSnapshot(JSON.parse(await readFile(temporaryPath, "utf8")));
    await rename(temporaryPath, snapshotPath);
  } catch (error) {
    await unlink(temporaryPath).catch(() => undefined);
    throw error;
  }
  return parseTokscaleSnapshot(snapshot);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  updateTokscaleSnapshot()
    .then((snapshot) => process.stdout.write(`Updated Tokscale snapshot (${snapshot.data.updatedAt})\n`))
    .catch((error) => {
      process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
      process.exitCode = 1;
    });
}
