import type {
  TokscaleContribution,
  TokscaleModelContribution,
  TokscaleTokenBreakdown,
} from "./data";

export type TokscaleUsagePeriod = "lifetime" | "30d" | "7d";

export type TokscaleUsageRange = {
  period: TokscaleUsagePeriod;
  startDate: string | null;
  endDate: string | null;
  activeDays: number;
  totalTokens: number;
  totalCost: number;
  selectedDate: string | null;
  contributions: TokscaleContribution[];
};

export type TokscaleDayModel = {
  modelId: string;
  totalTokens: number;
  cost: number;
  messages: number;
};

export type TokscaleDayClient = {
  client: string;
  totalTokens: number;
  cost: number;
  messages: number;
  models: TokscaleDayModel[];
};

export type TokscaleCalendarMonthMarker = {
  label: string;
  weekIndex: number;
  compactVisible: boolean;
};

export type TokscaleContributionCalendar = {
  cells: Array<{ date: string; inRange: boolean }>;
  displayEndDate: string | null;
  displayStartDate: string | null;
  weekCount: number;
  monthMarkers: TokscaleCalendarMonthMarker[];
};

const DAY_MS = 86_400_000;

function utcTimestamp(date: string): number {
  return Date.parse(`${date}T00:00:00Z`);
}

function dateKey(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function totalBreakdown(tokens: TokscaleTokenBreakdown): number {
  return tokens.input + tokens.output + tokens.cacheRead + tokens.cacheWrite + tokens.reasoning;
}

export function buildTokscaleUsageRange(
  contributions: readonly TokscaleContribution[],
  period: TokscaleUsagePeriod,
): TokscaleUsageRange {
  const sorted = [...contributions].sort((left, right) => left.date.localeCompare(right.date));
  const endDate = sorted.at(-1)?.date ?? null;
  if (!endDate) {
    return {
      period,
      startDate: null,
      endDate: null,
      activeDays: 0,
      totalTokens: 0,
      totalCost: 0,
      selectedDate: null,
      contributions: [],
    };
  }

  const windowDays = period === "30d" ? 30 : period === "7d" ? 7 : null;
  const startDate = windowDays
    ? dateKey(utcTimestamp(endDate) - (windowDays - 1) * DAY_MS)
    : sorted[0].date;
  const filtered = sorted.filter(({ date }) => date >= startDate && date <= endDate);

  return {
    period,
    startDate,
    endDate,
    activeDays: filtered.filter(({ totals }) => totals.tokens > 0).length,
    totalTokens: filtered.reduce((total, item) => total + item.totals.tokens, 0),
    totalCost: filtered.reduce((total, item) => total + item.totals.cost, 0),
    selectedDate: filtered.at(-1)?.date ?? endDate,
    contributions: filtered,
  };
}

function modelDetail(modelId: string, model: TokscaleModelContribution): TokscaleDayModel {
  return {
    modelId,
    totalTokens: Math.max(model.tokens, totalBreakdown(model)),
    cost: model.cost,
    messages: model.messages,
  };
}

export function getTokscaleDayBreakdown(day: TokscaleContribution) {
  const clients: TokscaleDayClient[] = day.clients.map((client) => {
    const models = Object.entries(client.models).map(([modelId, model]) =>
      modelDetail(modelId, model),
    );
    if (models.length === 0 && client.modelId) {
      // Legacy modelId-only client: present the client-level breakdown as the
      // model row so Day Breakdown stays complete.
      models.push({
        modelId: client.modelId,
        totalTokens: totalBreakdown(client.tokens),
        cost: client.cost,
        messages: client.messages,
      });
    }
    return {
      client: client.client,
      totalTokens: Math.max(totalBreakdown(client.tokens), ...models.map(({ totalTokens }) => totalTokens), 0),
      cost: client.cost,
      messages: client.messages || models.reduce((total, model) => total + model.messages, 0),
      models,
    };
  });

  return {
    date: day.date,
    totalTokens: day.totals.tokens,
    cost: day.totals.cost,
    messages: day.totals.messages || clients.reduce((total, client) => total + client.messages, 0),
    tokenCategories: [
      { label: "Input", value: day.tokenBreakdown.input },
      { label: "Output", value: day.tokenBreakdown.output },
      { label: "Cache read", value: day.tokenBreakdown.cacheRead },
      { label: "Cache write", value: day.tokenBreakdown.cacheWrite },
      { label: "Reasoning", value: day.tokenBreakdown.reasoning },
    ],
    clients,
  };
}

export function createTokscaleCalendarDays(range: TokscaleUsageRange): string[] {
  if (!range.startDate || !range.endDate) return [];
  const start = utcTimestamp(range.startDate);
  const end = utcTimestamp(range.endDate);
  const dates: string[] = [];
  for (let timestamp = start; timestamp <= end; timestamp += DAY_MS) {
    dates.push(dateKey(timestamp));
  }
  return dates;
}

const CALENDAR_MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

/**
 * Builds the Contributions calendar: always the latest 12 calendar months
 * ending at the latest contribution date (365-day inclusive range for
 * Lifetime; 30d/7d clamp the start to their own window's first contribution),
 * aligned to whole Sunday-start weeks like the original Tokscale graph. Also
 * returns the month markers placed on the week column each month starts in.
 */
export function buildTokscaleContributionCalendar(
  range: TokscaleUsageRange,
): TokscaleContributionCalendar {
  const endDate = range.endDate;
  if (!endDate) {
    return {
      cells: [],
      displayEndDate: null,
      displayStartDate: null,
      weekCount: 0,
      monthMarkers: [],
    };
  }

  const endTimestamp = utcTimestamp(endDate);
  const rollingStart = endTimestamp - 364 * DAY_MS;
  const displayStartTimestamp =
    range.period === "lifetime"
      ? rollingStart
      : Math.max(
          rollingStart,
          utcTimestamp(range.contributions[0]?.date ?? endDate),
        );
  const displayEndTimestamp = endTimestamp;

  const calendarStart =
    displayStartTimestamp - new Date(displayStartTimestamp).getUTCDay() * DAY_MS;
  const calendarEnd =
    displayEndTimestamp +
    (6 - new Date(displayEndTimestamp).getUTCDay()) * DAY_MS;
  const dayCount = Math.round((calendarEnd - calendarStart) / DAY_MS) + 1;
  const weekCount = dayCount / 7;

  const cells: TokscaleContributionCalendar["cells"] = [];
  for (let offset = 0; offset < dayCount; offset += 1) {
    const timestamp = calendarStart + offset * DAY_MS;
    cells.push({
      date: dateKey(timestamp),
      inRange:
        timestamp >= displayStartTimestamp && timestamp <= displayEndTimestamp,
    });
  }

  const monthMarkers: TokscaleCalendarMonthMarker[] = [];
  const markerWeeks = new Set<number>();
  let cursor = displayStartTimestamp;
  while (cursor <= displayEndTimestamp) {
    const date = new Date(cursor);
    const weekIndex = Math.floor((cursor - calendarStart) / (DAY_MS * 7));
    if (!markerWeeks.has(weekIndex)) {
      const month = date.getUTCMonth();
      const marker = {
        compactVisible: monthMarkers.length === 0 || month % 3 === 0,
        label: CALENDAR_MONTH_FORMATTER.format(date),
        weekIndex,
      };
      const previous = monthMarkers.at(-1);
      if (previous && weekIndex - previous.weekIndex < 3) {
        if (previous.weekIndex === 0) {
          monthMarkers[monthMarkers.length - 1] = marker;
        }
      } else {
        monthMarkers.push(marker);
      }
      markerWeeks.add(weekIndex);
    }
    cursor = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1);
  }

  return {
    cells,
    displayEndDate: dateKey(displayEndTimestamp),
    displayStartDate: dateKey(displayStartTimestamp),
    weekCount,
    monthMarkers,
  };
}

export function contributionForDate(
  contributions: readonly TokscaleContribution[],
  date: string,
): TokscaleContribution {
  return contributions.find((item) => item.date === date) ?? {
    date,
    intensity: 0,
    totals: { tokens: 0, cost: 0, messages: 0 },
    tokenBreakdown: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0 },
    clients: [],
  };
}
