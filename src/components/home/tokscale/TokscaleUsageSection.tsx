"use client";

import { useId, useState } from "react";
import type { TokscaleUsageData } from "@/lib/tokscale/data";
import { TokscaleUsageView } from "./TokscaleUsageView";

const TOKSCALE_PROFILE_URL = "https://tokscale.ai/u/maxlory";

function formatTokens(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCost(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatInteger(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

export function TokscaleUsageSection({ data }: { data: TokscaleUsageData | null }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();

  return (
    <section className="ei-tokscale" aria-label="Tokscale usage">
      <div className="ei-tokscale-heading">
        <div>
          <p className="ei-kicker">Token usage</p>
          <h2>Tokscale Summary</h2>
        </div>
        <a
          className="ei-tokscale-profile-link"
          href={TOKSCALE_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Original profile
        </a>
      </div>

      {data ? (
        <dl className="ei-tokscale-metrics">
          <div className="ei-tokscale-metric">
            <dt>All-time tokens</dt>
            <dd>{formatTokens(data.totalTokens)}</dd>
          </div>
          <div className="ei-tokscale-metric">
            <dt>All-time cost</dt>
            <dd>{formatCost(data.totalCost)}</dd>
          </div>
          <div className="ei-tokscale-metric">
            <dt>Active days (1y)</dt>
            <dd>{formatInteger(data.activeDays)}</dd>
          </div>
          <div className="ei-tokscale-metric">
            <dt>All submissions</dt>
            <dd>{formatInteger(data.submissionCount)}</dd>
          </div>
        </dl>
      ) : (
        <div className="ei-tokscale-unavailable" role="status">
          <strong>Usage summary unavailable</strong>
          <span>Tokscale could not be reached. The rest of this page is unaffected.</span>
        </div>
      )}

      <div className="ei-tokscale-disclosure">
        <button
          className="ei-tokscale-disclosure-toggle"
          type="button"
          aria-expanded={expanded}
          aria-controls={detailsId}
          onClick={() => setExpanded((current) => !current)}
        >
          <span>View usage details</span>
          <span aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>
        <div id={detailsId} hidden={!expanded} className="ei-tokscale-details">
          {data ? (
            <>
              <p className="ei-tokscale-source-note">Data from Tokscale, updated {new Date(data.updatedAt).toLocaleDateString("en-US")}.</p>
              <TokscaleUsageView data={data} />
            </>
          ) : (
            <p className="ei-tokscale-source-note">Open the original profile to view the latest available usage data.</p>
          )}
        </div>
      </div>
    </section>
  );
}
