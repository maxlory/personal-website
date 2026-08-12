import type { TokscaleContribution } from "./data";

export type TokscaleModelUsage = {
  model: string;
  tokens: number;
  cost: number;
  percentage: number;
};

/**
 * Aggregates model token/cost totals across every contribution in the given
 * (already period-scoped) window, mirroring Tokscale's server-side modelUsage
 * contract: `<synthetic>` rows are excluded, share is cost over the
 * non-synthetic total (0 when that total is 0), and rows sort by cost
 * descending with a token-descending tie-break.
 */
export function buildTokscaleModelUsage(
  contributions: readonly TokscaleContribution[],
): TokscaleModelUsage[] {
  const modelUsageMap = new Map<string, { tokens: number; cost: number }>();
  for (const day of contributions) {
    for (const client of day.clients) {
      const nestedModels = Object.entries(client.models);
      if (nestedModels.length === 0) {
        // Legacy modelId-only clients: synthesize from the client-level
        // breakdown so their tokens/cost still reach the Models table.
        if (!client.modelId) continue;
        const existing = modelUsageMap.get(client.modelId) ?? {
          tokens: 0,
          cost: 0,
        };
        existing.tokens +=
          client.tokens.input +
          client.tokens.output +
          client.tokens.cacheRead +
          client.tokens.cacheWrite +
          client.tokens.reasoning;
        existing.cost += client.cost;
        modelUsageMap.set(client.modelId, existing);
        continue;
      }
      for (const [modelId, data] of nestedModels) {
        const existing = modelUsageMap.get(modelId) ?? { tokens: 0, cost: 0 };
        existing.tokens += data.tokens;
        existing.cost += data.cost;
        modelUsageMap.set(modelId, existing);
      }
    }
  }

  const filtered = Array.from(modelUsageMap.entries()).filter(
    ([model]) => model !== "<synthetic>",
  );
  const totalModelCost = filtered.reduce((sum, [, data]) => sum + data.cost, 0);

  return filtered
    .map(([model, data]) => ({
      model,
      tokens: data.tokens,
      cost: data.cost,
      percentage: totalModelCost > 0 ? (data.cost / totalModelCost) * 100 : 0,
    }))
    .sort((a, b) => b.cost - a.cost || b.tokens - a.tokens);
}

/** Compact token formatting matching Tokscale's formatTokenCount semantics. */
export function formatModelTokens(value: number): string {
  const count = Number.isFinite(value) ? Math.max(0, value) : 0;
  if (count >= 1_000_000_000_000) {
    const val = (count / 1_000_000_000_000).toFixed(3).replace(/\.?0+$/, "");
    return `${val}T`;
  }
  if (count >= 1_000_000_000) {
    const val = count / 1_000_000_000;
    return val >= 999.95
      ? `${(val / 1000).toFixed(1)}T`
      : `${val.toFixed(1)}B`;
  }
  if (count >= 1_000_000) {
    const val = count / 1_000_000;
    return val >= 999.95
      ? `${(val / 1000).toFixed(1)}B`
      : `${val.toFixed(1)}M`;
  }
  if (count >= 1_000) {
    const val = count / 1_000;
    return val >= 999.95
      ? `${(val / 1000).toFixed(1)}M`
      : `${val.toFixed(1)}K`;
  }
  return count.toLocaleString("en-US");
}

/** Currency formatting matching Tokscale's formatCurrency semantics. */
export function formatModelCost(value: number): string {
  const amount = Number.isFinite(value) ? Math.max(0, value) : 0;
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(2)}B`;
  }
  if (amount >= 1_000_000) {
    const val = amount / 1_000_000;
    return val >= 999.995
      ? `$${(val / 1000).toFixed(2)}B`
      : `$${val.toFixed(2)}M`;
  }
  if (amount >= 1000) {
    const val = amount / 1000;
    return val >= 999.995
      ? `$${(val / 1000).toFixed(2)}M`
      : `$${val.toFixed(2)}K`;
  }
  return `$${amount.toFixed(2)}`;
}

/** One-decimal percentage share, matching Tokscale's Share cell. */
export function formatModelShare(value: number): string {
  return `${value.toFixed(1)}%`;
}
