"use client";

import { useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { TokscaleUsageData } from "@/lib/tokscale/data";
import { buildTokscaleModelUsage } from "@/lib/tokscale/models";
import {
  buildTokscaleContributionCalendar,
  buildTokscaleUsageRange,
  contributionForDate,
  getTokscaleDayBreakdown,
  type TokscaleUsagePeriod,
} from "@/lib/tokscale/usage";
import { TokscaleModelsTable } from "./TokscaleModelsTable";

type UsageView = "2d" | "3d";
const PERIODS: Array<{ label: string; value: TokscaleUsagePeriod }> = [
  { label: "Lifetime", value: "lifetime" },
  { label: "30d", value: "30d" },
  { label: "7d", value: "7d" },
];
const PALETTES = {
  Signal: ["#dfe3dc", "#c7d99a", "#b5d76a", "#a5dc3d", "#8cbd22"],
  Forest: ["#dfe3dc", "#b8cfbd", "#78a687", "#3f7757", "#175238"],
  Ink: ["#dfe3dc", "#aeb6af", "#747e76", "#3f4942", "#111512"],
} as const;

function formatTokens(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(value);
}
function formatCost(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}
function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
function intensity(tokens: number, maximum: number): number {
  if (tokens <= 0 || maximum <= 0) return 0;
  return Math.max(1, Math.min(4, Math.ceil((tokens / maximum) * 4)));
}
function supportsThreeDimensions(): boolean {
  try {
    return (
      typeof SVGSVGElement !== "undefined" &&
      typeof CSS !== "undefined" &&
      CSS.supports("transform", "rotateX(45deg)")
    );
  } catch {
    return false;
  }
}

const ISOMETRIC_CELL_WIDTH = 7.5;
const ISOMETRIC_CELL_DEPTH = 3.75;

function cubeFaces(centerX: number, centerY: number, height: number) {
  const topY = centerY - height;
  const leftX = centerX - ISOMETRIC_CELL_WIDTH;
  const rightX = centerX + ISOMETRIC_CELL_WIDTH;
  const middleY = topY + ISOMETRIC_CELL_DEPTH;
  const bottomTopY = topY + ISOMETRIC_CELL_DEPTH * 2;
  const middleBottomY = centerY + ISOMETRIC_CELL_DEPTH;
  const bottomY = centerY + ISOMETRIC_CELL_DEPTH * 2;
  return {
    left: `${leftX},${middleY} ${centerX},${bottomTopY} ${centerX},${bottomY} ${leftX},${middleBottomY}`,
    right: `${rightX},${middleY} ${centerX},${bottomTopY} ${centerX},${bottomY} ${rightX},${middleBottomY}`,
    top: `${centerX},${topY} ${rightX},${middleY} ${centerX},${bottomTopY} ${leftX},${middleY}`,
  };
}

function shadeContributionColor(color: string, percentage: number): string {
  return `color-mix(in srgb, ${color} ${percentage}%, #111512)`;
}

function TokscaleDayBreakdown({ day }: { day: ReturnType<typeof contributionForDate> }) {
  const breakdown = getTokscaleDayBreakdown(day);
  return (
    <section className="ei-tokscale-breakdown" aria-label="Day Breakdown" data-selected-date={breakdown.date}>
      <header className="ei-tokscale-breakdown-head">
        <div><p className="ei-tokscale-label">Day Breakdown</p><h3>{formatDate(breakdown.date)}</h3></div>
      </header>
      <div className="ei-tokscale-breakdown-totals">
        <dl className="ei-tokscale-day-totals">
          <div><dt>Total tokens</dt><dd>{formatTokens(breakdown.totalTokens)}</dd></div>
          <div><dt>Cost</dt><dd>{formatCost(breakdown.cost)}</dd></div>
          <div><dt>Messages</dt><dd>{breakdown.messages.toLocaleString("en-US")}</dd></div>
        </dl>
      </div>
      <section className="ei-tokscale-detail-section">
        <h4>Token categories</h4>
        <dl className="ei-tokscale-categories">
          {breakdown.tokenCategories.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{formatTokens(item.value)}</dd></div>)}
        </dl>
      </section>
      <section className="ei-tokscale-detail-section">
        <h4>Clients and models</h4>
        {breakdown.clients.length > 0 ? (
          <div className="ei-tokscale-client-list">
            {breakdown.clients.map((client, index) => (
              <article className="ei-tokscale-client" data-client={client.client} key={`${client.client}-${index}`}>
                <header><strong>{client.client}</strong><span>{formatTokens(client.totalTokens)} · {formatCost(client.cost)} · {client.messages} messages</span></header>
                <ul role="list">
                  {client.models.map((model) => (
                    <li data-model={model.modelId} key={model.modelId}>
                      <strong>{model.modelId || "Unknown model"}</strong><span>{formatTokens(model.totalTokens)} tokens</span><span>{formatCost(model.cost)}</span><span>{model.messages} messages</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : <p className="ei-tokscale-empty">No client or model activity for this day.</p>}
      </section>
    </section>
  );
}

export function TokscaleUsageView({ data }: { data: TokscaleUsageData }) {
  const [activeTab, setActiveTab] = useState<"usage" | "models">("usage");
  const [period, setPeriod] = useState<TokscaleUsagePeriod>("lifetime");
  const [view, setView] = useState<UsageView>("2d");
  const [paletteName, setPaletteName] = useState<keyof typeof PALETTES>("Signal");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [inspectionDate, setInspectionDate] = useState<string | null>(null);
  const usageTabId = useId(); const modelsTabId = useId(); const usagePanelId = useId(); const modelsPanelId = useId();
  const cellRefs = useRef(new Map<string, HTMLElement | SVGGElement>());
  const tabRefs = useRef(new Map<"usage" | "models", HTMLButtonElement>());
  const range = useMemo(() => buildTokscaleUsageRange(data.contributions, period), [data.contributions, period]);
  const calendar = useMemo(() => buildTokscaleContributionCalendar(range), [range]);
  const dates = useMemo(
    () => calendar.cells.filter((cell) => cell.inRange).map((cell) => cell.date),
    [calendar],
  );
  const byDate = useMemo(() => new Map(range.contributions.map((day) => [day.date, day])), [range.contributions]);
  const modelUsage = useMemo(() => buildTokscaleModelUsage(range.contributions), [range.contributions]);
  const maximumTokens = Math.max(0, ...range.contributions.map(({ totals }) => totals.tokens));
  const effectiveDate = selectedDate && dates.includes(selectedDate) ? selectedDate : range.selectedDate;
  const selectedDay = effectiveDate ? contributionForDate(range.contributions, effectiveDate) : null;
  const palette = PALETTES[paletteName];
  const isometric = useMemo(() => {
    const finalWeek = Math.max(0, calendar.weekCount - 1);
    const originX = 12 + 6 * ISOMETRIC_CELL_WIDTH;
    const originY = 12 + 100;
    const cells = calendar.cells.flatMap((cell, index) => {
      if (!cell.inRange) return [];
      const weekIndex = Math.floor(index / 7);
      const dayIndex = index % 7;
      const tokens = byDate.get(cell.date)?.totals.tokens ?? 0;
      const ratio = maximumTokens > 0 ? tokens / maximumTokens : 0;
      const height = tokens > 0 ? 4 + ratio * (100 - 4) : 1.5;
      return [
        {
          cell,
          centerX: originX + (weekIndex - dayIndex) * ISOMETRIC_CELL_WIDTH,
          centerY: originY + (weekIndex + dayIndex) * ISOMETRIC_CELL_DEPTH,
          height,
        },
      ];
    });
    return {
      cells,
      viewBox: {
        height:
          originY +
          (finalWeek + 6) * ISOMETRIC_CELL_DEPTH +
          ISOMETRIC_CELL_DEPTH * 2 +
          12,
        width:
          originX + finalWeek * ISOMETRIC_CELL_WIDTH + ISOMETRIC_CELL_WIDTH + 12,
      },
    };
  }, [calendar, byDate, maximumTokens]);

  function moveDate(currentDate: string, key: string) {
    const currentIndex = dates.indexOf(currentDate); if (currentIndex < 0) return;
    const requested = key === "Home" ? 0 : key === "End" ? dates.length - 1 : currentIndex + (key === "ArrowLeft" ? -1 : key === "ArrowRight" ? 1 : key === "ArrowUp" ? -7 : 7);
    const nextDate = dates[Math.max(0, Math.min(dates.length - 1, requested))];
    if (nextDate) { setInspectionDate(nextDate); cellRefs.current.get(nextDate)?.focus(); }
  }
  function onDateKey(date: string, event: KeyboardEvent<Element>) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) { event.preventDefault(); moveDate(date, event.key); }
    else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedDate(date); setInspectionDate(null); }
    else if (event.key === "Escape") { event.preventDefault(); setInspectionDate(null); }
  }
  function chooseView(next: UsageView) { setView(next === "3d" && !supportsThreeDimensions() ? "2d" : next); }
  function choosePeriod(next: TokscaleUsagePeriod) {
    const nextRange = buildTokscaleUsageRange(data.contributions, next);
    setPeriod(next);
    setSelectedDate(nextRange.selectedDate);
    setInspectionDate(null);
  }
  function selectTab(tab: "usage" | "models") {
    setActiveTab(tab);
    tabRefs.current.get(tab)?.focus();
  }
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, tab: "usage" | "models") {
    const order = ["usage", "models"] as const;
    const currentIndex = order.indexOf(tab);
    let nextIndex: number | null = null;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % order.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (currentIndex - 1 + order.length) % order.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = order.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectTab(order[nextIndex]);
  }

  return (
    <div className="ei-tokscale-usage-view">
      <div className="ei-tokscale-view-controls">
        <div role="tablist" aria-label="Tokscale data views" className="ei-tokscale-tabs">
          <button ref={(node) => { if (node) tabRefs.current.set("usage", node); else tabRefs.current.delete("usage"); }} id={usageTabId} role="tab" aria-controls={usagePanelId} aria-selected={activeTab === "usage"} tabIndex={activeTab === "usage" ? 0 : -1} type="button" onClick={() => setActiveTab("usage")} onKeyDown={(event) => onTabKey(event, "usage")}>Usage</button>
          <button ref={(node) => { if (node) tabRefs.current.set("models", node); else tabRefs.current.delete("models"); }} id={modelsTabId} role="tab" aria-controls={modelsPanelId} aria-selected={activeTab === "models"} tabIndex={activeTab === "models" ? 0 : -1} type="button" onClick={() => setActiveTab("models")} onKeyDown={(event) => onTabKey(event, "models")}>Models</button>
        </div>
        <div role="group" aria-label="Usage range" className="ei-tokscale-periods">
          {PERIODS.map((option) => <button type="button" key={option.value} aria-pressed={period === option.value} onClick={() => choosePeriod(option.value)}>{option.label}</button>)}
        </div>
      </div>
      <div id={usagePanelId} role="tabpanel" aria-labelledby={usageTabId} hidden={activeTab !== "usage"} className="ei-tokscale-usage-panel">
        {dates.length > 0 ? <>
          <figure className="ei-tokscale-contributions" aria-label="Contributions">
            <figcaption className="ei-tokscale-contribution-head">
              <div><p className="ei-tokscale-label">Contributions</p><h3>Recent year</h3><p>{range.activeDays} active days · {formatDate(calendar.displayStartDate!)} – {formatDate(calendar.displayEndDate!)}</p></div>
              <div className="ei-tokscale-view-toggle" aria-label="Contribution view">
                {(["2d", "3d"] as const).map((option) => <button type="button" key={option} aria-pressed={view === option} onClick={() => chooseView(option)}>{option.toUpperCase()}</button>)}
              </div>
            </figcaption>
            <div className={`ei-tokscale-calendar is-${view}`}>
              {view === "2d" ? (
                <>
                  <div className="ei-tokscale-month-row" aria-hidden="true">
                    {calendar.monthMarkers.map((marker) => (
                      <span
                        key={`${marker.weekIndex}-${marker.label}`}
                        className={`ei-tokscale-month-marker${marker.compactVisible ? "" : " is-collapsible"}`}
                        style={{ gridColumn: marker.weekIndex + 1 }}
                      >
                        {marker.label}
                      </span>
                    ))}
                  </div>
                  <div className="ei-tokscale-calendar-row">
                    <div className="ei-tokscale-day-labels" aria-hidden="true">
                      <span style={{ gridRow: 2 }}>Mon</span>
                      <span style={{ gridRow: 4 }}>Wed</span>
                      <span style={{ gridRow: 6 }}>Fri</span>
                    </div>
                    <div className="ei-tokscale-date-grid" role="group" aria-label="Daily token contributions" aria-describedby={`${usagePanelId}-instructions`}>
                      {calendar.cells.map((cell) => {
                        const date = cell.date;
                        const day = byDate.get(date); const level = intensity(day?.totals.tokens ?? 0, maximumTokens); const inspected = inspectionDate === date;
                        return cell.inRange ? (
                          <button type="button" ref={(node) => { if (node) cellRefs.current.set(date, node); else cellRefs.current.delete(date); }} key={date} data-contribution-date={date} tabIndex={effectiveDate === date ? 0 : -1} aria-label={`${formatDate(date)}: ${formatTokens(day?.totals.tokens ?? 0)} tokens`} aria-current={effectiveDate === date ? "date" : undefined} className={effectiveDate === date ? "is-selected" : ""} style={{ backgroundColor: palette[level], "--contribution-height": `${Math.max(2, level * 7)}px` } as CSSProperties} onFocus={() => setInspectionDate(date)} onBlur={() => setInspectionDate(null)} onMouseEnter={() => setInspectionDate(date)} onMouseLeave={() => setInspectionDate(null)} onClick={() => setSelectedDate(date)} onKeyDown={(event) => onDateKey(date, event)}><span aria-hidden="true" />{inspected && <span role="tooltip" className="ei-tokscale-tooltip">{formatDate(date)} · {formatTokens(day?.totals.tokens ?? 0)} tokens</span>}</button>
                        ) : (
                          <button type="button" key={date} disabled aria-hidden="true" className="ei-tokscale-calendar-pad"><span aria-hidden="true" /></button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="ei-tokscale-isometric">
                  <svg
                    role="group"
                    aria-label="Isometric daily token contributions"
                    aria-describedby={`${usagePanelId}-instructions`}
                    viewBox={`0 0 ${isometric.viewBox.width} ${isometric.viewBox.height}`}
                    className="ei-tokscale-isometric-svg"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {isometric.cells.map(({ cell, centerX, centerY, height }) => {
                      const date = cell.date;
                      const day = byDate.get(date);
                      const level = intensity(day?.totals.tokens ?? 0, maximumTokens);
                      const color = palette[level];
                      const faces = cubeFaces(centerX, centerY, height);
                      return (
                        <g
                          key={date}
                          ref={(node) => { if (node) cellRefs.current.set(date, node); else cellRefs.current.delete(date); }}
                          role="button"
                          tabIndex={effectiveDate === date ? 0 : -1}
                          aria-label={`${formatDate(date)}: ${formatTokens(day?.totals.tokens ?? 0)} tokens`}
                          aria-current={effectiveDate === date ? "date" : undefined}
                          data-contribution-date={date}
                          data-contribution-view="3d"
                          className={effectiveDate === date ? "is-selected" : ""}
                          style={{ cursor: "pointer" }}
                          onFocus={() => setInspectionDate(date)}
                          onBlur={() => setInspectionDate(null)}
                          onMouseEnter={() => setInspectionDate(date)}
                          onMouseLeave={() => setInspectionDate(null)}
                          onClick={() => setSelectedDate(date)}
                          onKeyDown={(event) => onDateKey(date, event)}
                        >
                          <polygon points={faces.left} fill={shadeContributionColor(color, 58)} />
                          <polygon points={faces.right} fill={shadeContributionColor(color, 72)} />
                          <polygon points={faces.top} fill={color} />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}
            </div>
            <div className="ei-tokscale-contribution-footer">
              <label><span>Color</span><select aria-label="Contribution graph color" value={paletteName} onChange={(event) => setPaletteName(event.target.value as keyof typeof PALETTES)}>{Object.keys(PALETTES).map((name) => <option key={name}>{name}</option>)}</select></label>
              <div className="ei-tokscale-legend" aria-label="Contribution intensity, low to high"><span>Low</span>{palette.map((color) => <i key={color} style={{ backgroundColor: color }} />)}<span>High</span></div>
            </div>
            <p id={`${usagePanelId}-instructions`} className="ei-visually-hidden">Use arrow keys to inspect adjacent days, Home and End for bounds, Enter or Space to select, and Escape to close inspection.</p>
          </figure>
          {selectedDay && <TokscaleDayBreakdown day={selectedDay} />}
        </> : <p className="ei-tokscale-empty">No contribution data is available.</p>}
      </div>
      <div id={modelsPanelId} role="tabpanel" aria-labelledby={modelsTabId} hidden={activeTab !== "models"} className="ei-tokscale-models-panel">
        <TokscaleModelsTable usage={modelUsage} />
      </div>
    </div>
  );
}
