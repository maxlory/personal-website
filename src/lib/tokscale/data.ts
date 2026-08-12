import snapshot from "./snapshot.json" with { type: "json" };

export const TOKSCALE_REQUEST_TIMEOUT_MS = 10_000;

const TOKSCALE_SUMMARY_URL = "https://tokscale.ai/api/users/maxlory";

export type TokscaleSummary = {
  totalTokens: number;
  totalCost: number;
  activeDays: number;
  submissionCount: number;
  updatedAt: string;
};

export type TokscaleTokenBreakdown = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  reasoning: number;
};

export type TokscaleModelContribution = TokscaleTokenBreakdown & {
  tokens: number;
  cost: number;
  messages: number;
};

export type TokscaleClientContribution = {
  client: string;
  modelId: string;
  providerId?: string;
  tokens: TokscaleTokenBreakdown;
  cost: number;
  messages: number;
  models: Record<string, TokscaleModelContribution>;
};

export type TokscaleContribution = {
  date: string;
  intensity: number;
  totals: { tokens: number; cost: number; messages: number };
  tokenBreakdown: TokscaleTokenBreakdown;
  clients: TokscaleClientContribution[];
};

export type TokscaleUsageData = TokscaleSummary & {
  contributions: TokscaleContribution[];
};

type TokscaleFetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function requireFiniteNumber(
  record: Record<string, unknown>,
  field: string,
): number {
  const value = record[field];
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`Invalid Tokscale field: ${field}`);
  }
  return value;
}

function requireString(record: Record<string, unknown>, field: string): string {
  const value = record[field];
  if (typeof value !== "string") {
    throw new Error(`Invalid Tokscale field: ${field}`);
  }
  return value;
}

function requireRecord(value: unknown, field: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`Invalid Tokscale field: ${field}`);
  return value;
}

function parseTokenBreakdown(
  value: unknown,
  field: string,
): TokscaleTokenBreakdown {
  const record = requireRecord(value, field);
  return {
    input: requireFiniteNumber(record, "input"),
    output: requireFiniteNumber(record, "output"),
    cacheRead: requireFiniteNumber(record, "cacheRead"),
    cacheWrite: requireFiniteNumber(record, "cacheWrite"),
    reasoning: requireFiniteNumber(record, "reasoning"),
  };
}

function parseModelContribution(value: unknown): TokscaleModelContribution {
  const record = requireRecord(value, "model");
  return {
    ...parseTokenBreakdown(record, "model"),
    tokens: requireFiniteNumber(record, "tokens"),
    cost: requireFiniteNumber(record, "cost"),
    messages: requireFiniteNumber(record, "messages"),
  };
}

function parseClientContribution(value: unknown): TokscaleClientContribution {
  const record = requireRecord(value, "client");
  // Legacy payloads carry only a client-level modelId and no nested models;
  // normalize them to an empty models map like the upstream profile adapter.
  const modelRecords = isRecord(record.models) ? record.models : {};
  const models = Object.fromEntries(
    Object.entries(modelRecords).map(([modelId, model]) => [
      modelId,
      parseModelContribution(model),
    ]),
  );

  return {
    client: requireString(record, "client"),
    modelId: requireString(record, "modelId"),
    ...(typeof record.providerId === "string"
      ? { providerId: record.providerId }
      : {}),
    tokens: parseTokenBreakdown(record.tokens, "tokens"),
    cost: requireFiniteNumber(record, "cost"),
    messages: requireFiniteNumber(record, "messages"),
    models,
  };
}

function parseContribution(value: unknown): TokscaleContribution {
  const record = requireRecord(value, "contribution");
  const date = requireString(record, "date");
  const parsedDate = Date.parse(`${date}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(parsedDate) ||
    new Date(parsedDate).toISOString().slice(0, 10) !== date
  ) {
    throw new Error("Invalid Tokscale field: date");
  }
  const totals = requireRecord(record.totals, "totals");
  if (!Array.isArray(record.clients)) {
    throw new Error("Invalid Tokscale field: clients");
  }

  return {
    date,
    intensity: requireFiniteNumber(record, "intensity"),
    totals: {
      tokens: requireFiniteNumber(totals, "tokens"),
      cost: requireFiniteNumber(totals, "cost"),
      messages: requireFiniteNumber(totals, "messages"),
    },
    tokenBreakdown: parseTokenBreakdown(record.tokenBreakdown, "tokenBreakdown"),
    clients: record.clients.map(parseClientContribution),
  };
}

export function parseTokscaleSummary(payload: unknown): TokscaleSummary {
  if (!isRecord(payload) || !isRecord(payload.stats)) {
    throw new Error("Invalid Tokscale summary payload");
  }

  const updatedAt = payload.updatedAt;
  if (
    typeof updatedAt !== "string" ||
    updatedAt.length === 0 ||
    !Number.isFinite(Date.parse(updatedAt))
  ) {
    throw new Error("Invalid Tokscale field: updatedAt");
  }

  return {
    totalTokens: requireFiniteNumber(payload.stats, "totalTokens"),
    totalCost: requireFiniteNumber(payload.stats, "totalCost"),
    activeDays: requireFiniteNumber(payload.stats, "activeDays"),
    submissionCount: requireFiniteNumber(payload.stats, "submissionCount"),
    updatedAt,
  };
}

export function parseTokscaleUsageData(payload: unknown): TokscaleUsageData {
  if (!isRecord(payload) || !Array.isArray(payload.contributions)) {
    throw new Error("Invalid Tokscale contributions payload");
  }

  return {
    ...parseTokscaleSummary(payload),
    contributions: payload.contributions
      .map(parseContribution)
      .sort((left, right) => left.date.localeCompare(right.date)),
  };
}

async function requestTokscale(fetcher: TokscaleFetch): Promise<Response> {
  const response = await fetcher(TOKSCALE_SUMMARY_URL, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(TOKSCALE_REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Tokscale request failed with ${response.status}`);
  }

  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error("Tokscale returned a non-JSON response");
  }
  return response;
}

export async function fetchTokscaleSummary(
  fetcher: TokscaleFetch = fetch,
): Promise<TokscaleSummary> {
  const response = await requestTokscale(fetcher);
  return parseTokscaleSummary(await response.json());
}

export async function fetchTokscaleUsageData(
  fetcher: TokscaleFetch = fetch,
): Promise<TokscaleUsageData> {
  const response = await requestTokscale(fetcher);
  return parseTokscaleUsageData(await response.json());
}

export async function getTokscaleSummary(): Promise<TokscaleSummary | null> {
  try {
    return await fetchTokscaleSummary();
  } catch {
    return null;
  }
}

export async function getTokscaleUsageData(): Promise<TokscaleUsageData | null> {
  try {
    if (
      snapshot.schemaVersion !== 1 ||
      snapshot.source !== TOKSCALE_SUMMARY_URL ||
      !Number.isFinite(Date.parse(snapshot.fetchedAt))
    ) {
      throw new Error("Invalid Tokscale snapshot envelope");
    }
    return parseTokscaleUsageData(snapshot.payload);
  } catch {
    return null;
  }
}
