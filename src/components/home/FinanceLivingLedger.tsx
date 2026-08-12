"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type {
  FinanceAnalysisChain,
  FinanceCaseStage,
  FinanceCell,
  FinanceWorkbookSheet,
} from "@/content/finance-skills";

/**
 * PW-03 Living Ledger month-end case (design-spec section 7, AC-F02..F06,
 * AC-G03..G07, AC-G10).
 *
 * Instrument-like evidence ledger: an ordered stage rail with a numbered
 * spine, a focused canvas that reveals one stage at a time, artifact tables
 * (with saved vs contract-fitted evidence tags), a real-tab workbook and a
 * causal three-Skill analysis chain. All content comes from the frozen
 * financeCase / workbookSheets / renderAnalysis data in
 * skills-process-atlas-v4.html.
 *
 * State changes use Framer Motion only for a short opacity/translate reveal
 * (200ms) and are immediate under prefers-reduced-motion. The workbook Sheet
 * switcher uses real tab semantics with keyboard support.
 */

const WORKBOOK_STAGE_INDEX = 3;

/**
 * Deterministic prefers-reduced-motion detection. SSR and the first client
 * render agree on `false` (avoiding hydration mismatch); the effect updates
 * the state as soon as the real preference is known and on later changes.
 */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function cellValue(cell: FinanceCell): string {
  return typeof cell === "string" ? cell : cell.value;
}

function cellTone(cell: FinanceCell): string | undefined {
  return typeof cell === "object" ? cell.tone : undefined;
}

function ArtifactTable({ stage }: { stage: FinanceCaseStage }) {
  return (
    <div className="ledger-artifact">
      <p className="ledger-table-summary">
        <span aria-hidden="true">关键字段：</span>
        {stage.summary}
      </p>
      <div className="ledger-table-scroll">
        <table className="ledger-table">
          <thead>
            <tr>
              {stage.headers?.map((header) => (
                <th key={header} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stage.rows?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  const tone = cellTone(cell);
                  return (
                    <td
                      key={cellIndex}
                      className={tone ? `tone-${tone}` : undefined}
                    >
                      {cellValue(cell)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Workbook({
  sheets,
  activeSheet,
  footnote,
  onSelect,
}: {
  sheets: FinanceWorkbookSheet[];
  activeSheet: string;
  footnote: string;
  onSelect: (name: string) => void;
}) {
  const sheetRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sheetIndex = Math.max(
    0,
    sheets.findIndex((item) => item.name === activeSheet),
  );
  const sheet = sheets[sheetIndex];

  const onSheetKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const count = sheets.length;
    const move = (next: number) => {
      event.preventDefault();
      onSelect(sheets[next].name);
      sheetRefs.current[next]?.focus();
    };
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        move((sheetIndex + 1) % count);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        move((sheetIndex - 1 + count) % count);
        break;
      case "Home":
        move(0);
        break;
      case "End":
        move(count - 1);
        break;
    }
  };

  return (
    <div className="ledger-workbook" data-workbook>
      <div
        className="ledger-sheet-tabs"
        role="tablist"
        aria-label="月末财务包 Sheet"
        onKeyDown={onSheetKeyDown}
      >
        {sheets.map((item, index) => (
          <button
            key={item.name}
            ref={(element) => {
              sheetRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`ledger-sheet-tab-${index}`}
            aria-selected={index === sheetIndex}
            aria-controls="ledger-sheet-panel"
            tabIndex={index === sheetIndex ? 0 : -1}
            className="ledger-sheet-tab"
            onClick={() => onSelect(item.name)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div
        className="ledger-sheet-purpose"
        id="ledger-sheet-panel"
        role="tabpanel"
        aria-labelledby={`ledger-sheet-tab-${sheetIndex}`}
      >
        <b>{sheet.name}</b>
        <span>
          {sheet.purpose} {sheet.link}
        </span>
      </div>

      <div className="ledger-sheet-content">
        <table className="ledger-table">
          <thead>
            <tr>
              {sheet.headers.map((header) => (
                <th key={header} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheet.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((value, cellIndex) => (
                  <td key={cellIndex}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="ledger-sheet-foot">{footnote}</p>
    </div>
  );
}

function AnalysisChain({ chain }: { chain: FinanceAnalysisChain }) {
  return (
    <div className="ledger-analysis">
      <div className="ledger-analysis-steps">
        {chain.steps.map((step) => (
          <article key={step.skill} className="ledger-analysis-step">
            <code>{step.skill}</code>
            <h4>{step.title}</h4>
            <p>{step.intro}</p>
            <dl className="ledger-analysis-facts">
              {step.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
              <div>
                <dt>{step.outputLabel}</dt>
                <dd>{step.output}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="ledger-metric-thread">
        {chain.thread.map((item) => (
          <div key={item.label} className="ledger-thread-item">
            <b>{item.label}</b>
            <span>{item.value}</span>
          </div>
        ))}
      </div>

      <p className="ledger-callout">{chain.callout}</p>
    </div>
  );
}

export default function FinanceLivingLedger({
  stages,
  sheets,
  footnote,
  analysis,
}: {
  stages: FinanceCaseStage[];
  sheets: FinanceWorkbookSheet[];
  footnote: string;
  analysis: FinanceAnalysisChain;
}) {
  const [selected, setSelected] = useState(0);
  const [activeSheet, setActiveSheet] = useState(sheets[0]?.name ?? "");
  const reduceMotion = usePrefersReducedMotion();
  const stageRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectStage = (index: number) => {
    setSelected(index);
    if (index === WORKBOOK_STAGE_INDEX) {
      setActiveSheet(sheets[0]?.name ?? "");
    }
  };

  const onStageKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const count = stages.length;
    const move = (next: number) => {
      event.preventDefault();
      selectStage(next);
      stageRefs.current[next]?.focus();
    };
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        move((selected + 1) % count);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        move((selected - 1 + count) % count);
        break;
      case "Home":
        move(0);
        break;
      case "End":
        move(count - 1);
        break;
    }
  };

  const stage = stages[selected];
  const canvasPanelId = "ledger-stage-panel";
  const canvas = (
    <>
      <span
        className={`ledger-evidence-tag ${
          stage.kind === "saved" ? "is-saved" : "is-contract"
        }`}
      >
        {stage.tag}
      </span>

      <h3 className="ledger-canvas-title">{stage.title}</h3>
      <p className="ledger-canvas-copy">{stage.copy}</p>

      <div className="finance-skill-list" aria-label={`${stage.title} Skills`}>
        {stage.skills.map((skill) => (
          <span key={skill} className="finance-skill-chip">
            {skill}
          </span>
        ))}
      </div>

      {stage.kind === "workbook" ? (
        <Workbook
          sheets={sheets}
          activeSheet={activeSheet}
          footnote={footnote}
          onSelect={setActiveSheet}
        />
      ) : stage.kind === "analysis" ? (
        <AnalysisChain chain={analysis} />
      ) : stage.headers && stage.rows ? (
        <ArtifactTable stage={stage} />
      ) : null}
    </>
  );

  return (
    <div className="ledger" data-living-ledger>
      <div
        className="ledger-stage-rail"
        role="tablist"
        aria-label="月末财务包阶段"
        aria-orientation="vertical"
        onKeyDown={onStageKeyDown}
      >
        {stages.map((item, index) => (
          <button
            key={item.title}
            ref={(element) => {
              stageRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`ledger-stage-tab-${index}`}
            aria-selected={selected === index}
            aria-controls="ledger-stage-panel"
            tabIndex={selected === index ? 0 : -1}
            className="ledger-stage-button"
            onClick={() => selectStage(index)}
          >
            <span className="ledger-stage-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="ledger-stage-title">{item.title}</span>
          </button>
        ))}
      </div>

      {reduceMotion ? (
        <div
          className="ledger-canvas"
          role="tabpanel"
          id={canvasPanelId}
          aria-labelledby={`ledger-stage-tab-${selected}`}
          aria-live="polite"
        >
          {canvas}
        </div>
      ) : (
        <motion.div
          key={stage.title}
          className="ledger-canvas"
          role="tabpanel"
          id={canvasPanelId}
          aria-labelledby={`ledger-stage-tab-${selected}`}
          aria-live="polite"
          initial={{ opacity: 0.55, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          {canvas}
        </motion.div>
      )}
    </div>
  );
}
