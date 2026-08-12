export const TOKSCALE_SOURCE_URL = "https://tokscale.ai/api/users/maxlory";

const record = (value, field) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Invalid Tokscale field: ${field}`);
  }
  return value;
};

const number = (value, field) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`Invalid Tokscale field: ${field}`);
  }
  return value;
};

const string = (value, field) => {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Invalid Tokscale field: ${field}`);
  }
  return value;
};

const tokens = (value, field) => {
  const item = record(value, field);
  return {
    input: number(item.input, `${field}.input`),
    output: number(item.output, `${field}.output`),
    cacheRead: number(item.cacheRead, `${field}.cacheRead`),
    cacheWrite: number(item.cacheWrite, `${field}.cacheWrite`),
    reasoning: number(item.reasoning, `${field}.reasoning`),
  };
};

const model = (value, field) => {
  const item = record(value, field);
  return {
    ...tokens(item, field),
    tokens: number(item.tokens, `${field}.tokens`),
    cost: number(item.cost, `${field}.cost`),
    messages: number(item.messages, `${field}.messages`),
  };
};

const client = (value, field) => {
  const item = record(value, field);
  const modelValues =
    typeof item.models === "object" && item.models !== null && !Array.isArray(item.models)
      ? item.models
      : {};
  return {
    client: string(item.client, `${field}.client`),
    modelId: typeof item.modelId === "string" ? item.modelId : "",
    ...(typeof item.providerId === "string" ? { providerId: item.providerId } : {}),
    tokens: tokens(item.tokens, `${field}.tokens`),
    cost: number(item.cost, `${field}.cost`),
    messages: number(item.messages, `${field}.messages`),
    models: Object.fromEntries(
      Object.entries(modelValues).map(([id, value]) => [id, model(value, `${field}.models.${id}`)]),
    ),
  };
};

const contribution = (value, index) => {
  const field = `contributions.${index}`;
  const item = record(value, field);
  const date = string(item.date, `${field}.date`);
  const parsedDate = Date.parse(`${date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsedDate) || new Date(parsedDate).toISOString().slice(0, 10) !== date) {
    throw new Error(`Invalid Tokscale field: ${field}.date`);
  }
  if (!Array.isArray(item.clients)) throw new Error(`Invalid Tokscale field: ${field}.clients`);
  const totals = record(item.totals, `${field}.totals`);
  return {
    date,
    intensity: number(item.intensity, `${field}.intensity`),
    totals: {
      tokens: number(totals.tokens, `${field}.totals.tokens`),
      cost: number(totals.cost, `${field}.totals.cost`),
      messages: number(totals.messages, `${field}.totals.messages`),
    },
    tokenBreakdown: tokens(item.tokenBreakdown, `${field}.tokenBreakdown`),
    clients: item.clients.map((value, clientIndex) => client(value, `${field}.clients.${clientIndex}`)),
  };
};

export function parseTokscaleUsageData(payload) {
  const source = record(payload, "payload");
  const stats = record(source.stats, "stats");
  if (!Array.isArray(source.contributions)) throw new Error("Invalid Tokscale field: contributions");
  const updatedAt = string(source.updatedAt, "updatedAt");
  if (!Number.isFinite(Date.parse(updatedAt))) throw new Error("Invalid Tokscale field: updatedAt");
  return {
    totalTokens: number(stats.totalTokens, "stats.totalTokens"),
    totalCost: number(stats.totalCost, "stats.totalCost"),
    activeDays: number(stats.activeDays, "stats.activeDays"),
    submissionCount: number(stats.submissionCount, "stats.submissionCount"),
    updatedAt,
    contributions: source.contributions.map(contribution).sort((a, b) => a.date.localeCompare(b.date)),
  };
}

export function createTokscaleSnapshot(payload, fetchedAt = new Date().toISOString()) {
  const data = parseTokscaleUsageData(payload);
  if (!Number.isFinite(Date.parse(fetchedAt))) throw new Error("Invalid Tokscale snapshot fetchedAt");
  return {
    schemaVersion: 1,
    source: TOKSCALE_SOURCE_URL,
    fetchedAt,
    payload: {
      stats: {
        totalTokens: data.totalTokens,
        totalCost: data.totalCost,
        activeDays: data.activeDays,
        submissionCount: data.submissionCount,
      },
      updatedAt: data.updatedAt,
      contributions: data.contributions,
    },
  };
}

export function parseTokscaleSnapshot(value) {
  const snapshot = record(value, "snapshot");
  if (snapshot.schemaVersion !== 1) throw new Error("Unsupported Tokscale snapshot schemaVersion");
  if (snapshot.source !== TOKSCALE_SOURCE_URL) throw new Error("Invalid Tokscale snapshot source");
  const fetchedAt = string(snapshot.fetchedAt, "fetchedAt");
  if (!Number.isFinite(Date.parse(fetchedAt))) throw new Error("Invalid Tokscale snapshot fetchedAt");
  return { schemaVersion: 1, source: TOKSCALE_SOURCE_URL, fetchedAt, data: parseTokscaleUsageData(snapshot.payload) };
}
