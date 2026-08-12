"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { DevelopRecoveryCaseData } from "@/content/develop-harness";

/**
 * PW-05 任务恢复 evidence chain (ticket PW-05, spec AC-D05; design-spec
 * section 8, Evidence Control Room).
 *
 * The case opens under an explicit 案例拆解 section, names the case 任务恢复,
 * and states the plain-language business problem and the evidence-id reading
 * rule before RA-06 / UAT2-001 appear. The eight frozen stages
 * 确认目标、写清行为、冻结任务单、暴露缺口、首轮实现、第一轮检查、
 * 第二轮检查、重新验证 form a keyboard-operable tab rail; each selection
 * reveals the exact stage name, flow label, evidence tag, copy and the
 * approved V4 artifact table with the exact verified numbers. The final
 * stage proves RA-06 local backend completion only, and the closing
 * 验收边界 section separates 已经证明 from 尚未证明 so RA-11/RA-12 are
 * never presented as completed evidence.
 *
 * State changes are explicit 200ms opacity/short-translate and become
 * immediate under prefers-reduced-motion (AC-G05, AC-G07).
 */

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

function cellTone(value: string): "good" | "risk" | null {
  if (value.includes("passed") || value === "[]" || value.includes("通过")) {
    return "good";
  }
  if (value.includes("failed")) {
    return "risk";
  }
  return null;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderCell(value: string, tokens?: string[]) {
  if (!tokens || tokens.length === 0) {
    return value;
  }
  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "g");
  return value.split(pattern).map((part, index) =>
    tokens.includes(part) ? (
      <code key={`${part}-${index}`}>{part}</code>
    ) : (
      part
    ),
  );
}

export default function DevelopRecoveryCase({
  caseData,
}: {
  caseData: DevelopRecoveryCaseData;
}) {
  const [selected, setSelected] = useState(0);
  const reduceMotion = usePrefersReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    setSelected(index);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const count = caseData.stages.length;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        select((selected + 1) % count);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        select((selected - 1 + count) % count);
        break;
      case "Home":
        event.preventDefault();
        select(0);
        break;
      case "End":
        event.preventDefault();
        select(count - 1);
        break;
    }
  };

  const stage = caseData.stages[selected];
  const panelId = "develop-recovery-panel";

  const detail = (
    <>
      <span className="develop-case-tag">{stage.tag}</span>
      <h3 className="develop-case-title">{stage.title}</h3>
      <p className="develop-case-copy">{stage.copy}</p>
      <div className="develop-case-skills" aria-label="流程环节">
        {stage.skills.split(" + ").map((skill) => (
          <span key={skill} className="develop-skill-chip">
            {skill}
          </span>
        ))}
      </div>
      {stage.artifact ? (
        <div className="develop-artifact">
          <div className="develop-table-scroll">
            <table className="develop-table">
              <thead>
                <tr>
                  {stage.artifact.headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stage.artifact.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => {
                      const tone = cellTone(cell);
                      return (
                        <td
                          key={`${cell}-${cellIndex}`}
                          className={tone ? `tone-${tone}` : undefined}
                        >
                          {renderCell(cell, stage.artifact?.codeTokens)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
      {stage.callout ? (
        <p className="develop-case-callout">{stage.callout}</p>
      ) : null}
    </>
  );

  return (
    <>
      <section
        className="develop-section develop-case-section"
        aria-labelledby="develop-case-heading"
      >
        <div className="develop-section-head">
          <p className="section-kicker">Evidence chain</p>
          <h2 id="develop-case-heading" className="develop-section-title">
            {caseData.sectionTitle}
          </h2>
          <p className="develop-section-intro">{caseData.sectionIntro}</p>
          <div className="develop-case-name">
            <h3>{caseData.caseName}</h3>
            <p>{caseData.caseNote}</p>
          </div>
        </div>

        <div className="develop-case">
          <div
            className="develop-case-rail"
            role="tablist"
            aria-label={caseData.railLabel}
            onKeyDown={onKeyDown}
          >
            {caseData.stages.map((item, index) => (
              <button
                key={item.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                id={`develop-recovery-tab-${item.id}`}
                aria-selected={selected === index}
                aria-controls={panelId}
                tabIndex={selected === index ? 0 : -1}
                className="develop-case-step"
                onClick={() => select(index)}
              >
                <span className="develop-case-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <b>{item.title}</b>
                <small>{item.skills}</small>
              </button>
            ))}
          </div>

          <div
            className="develop-case-canvas"
            id={panelId}
            role="tabpanel"
            aria-labelledby={`develop-recovery-tab-${stage.id}`}
            aria-live="polite"
          >
            {reduceMotion ? (
              <div className="develop-case-content">{detail}</div>
            ) : (
              <motion.div
                key={stage.id}
                className="develop-case-content"
                initial={{ opacity: 0.55, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                {detail}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section
        className="develop-section develop-boundary-section"
        aria-labelledby="develop-boundary-heading"
      >
        <div className="develop-section-head">
          <p className="section-kicker">Acceptance boundary</p>
          <h2 id="develop-boundary-heading" className="develop-section-title">
            {caseData.boundaryTitle}
          </h2>
          <p className="develop-section-intro">{caseData.boundaryIntro}</p>
        </div>
        <div className="develop-boundary">
          <div className="develop-boundary-column is-proven">
            <h3>{caseData.provenTitle}</h3>
            <ul>
              {caseData.provenItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="develop-boundary-column is-limited">
            <h3>{caseData.limitedTitle}</h3>
            <ul>
              {caseData.limitedItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
