"use client";

import { useRef, useState } from "react";
import type { FinanceStage } from "@/content/finance-skills";

/**
 * Seven-stage Finance Skills instrument rail (AC-F01, AC-G04).
 *
 * Desktop renders as a rail + detail panel; the same markup collapses to a
 * direct vertical representation on mobile. Stage selection is keyboard
 * operable: ArrowLeft/ArrowRight/ArrowUp/ArrowDown move selection and focus,
 * Home/End jump to the first/last stage, Enter/Space activate the focused tab.
 * State switches are immediate (no positional or scale animation), so
 * prefers-reduced-motion keeps the complete contract.
 */
export default function FinanceSkillsAtlas({
  stages,
}: {
  stages: FinanceStage[];
}) {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    setSelected(index);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const count = stages.length;
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

  const stage = stages[selected];

  return (
    <div className="finance-atlas" data-finance-atlas>
      <div
        className="finance-rail"
        role="tablist"
        aria-label="财务流程环节"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
      >
        {stages.map((item, index) => (
          <button
            key={item.title}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`finance-stage-tab-${index}`}
            aria-selected={selected === index}
            aria-controls="finance-stage-panel"
            tabIndex={selected === index ? 0 : -1}
            className="finance-rail-button"
            onClick={() => select(index)}
          >
            <span className="finance-rail-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="finance-rail-title">{item.title}</span>
            <span className="finance-rail-meta">{item.meta}</span>
          </button>
        ))}
      </div>

      <div
        className="finance-panel"
        role="tabpanel"
        id="finance-stage-panel"
        aria-labelledby={`finance-stage-tab-${selected}`}
        aria-live="polite"
      >
        <p className="finance-panel-meta">{stage.meta}</p>
        <h3 className="finance-panel-title">{stage.title}</h3>
        <p className="finance-panel-copy">{stage.copy}</p>

        <dl className="finance-detail-grid">
          <div className="finance-detail-item">
            <dt>为什么需要</dt>
            <dd>{stage.why}</dd>
          </div>
          <div className="finance-detail-item">
            <dt>贯穿案例</dt>
            <dd>{stage.example}</dd>
          </div>
          <div className="finance-detail-item">
            <dt>输入</dt>
            <dd>{stage.input}</dd>
          </div>
          <div className="finance-detail-item">
            <dt>输出</dt>
            <dd>{stage.output}</dd>
          </div>
          <div className="finance-detail-item">
            <dt>下一步</dt>
            <dd>{stage.next}</dd>
          </div>
          <div className="finance-detail-item">
            <dt>协同关系</dt>
            <dd>{stage.collaboration}</dd>
          </div>
        </dl>

        <div className="finance-skill-list" aria-label={`${stage.title} Skills`}>
          {stage.skills.map((skill) => (
            <span key={skill} className="finance-skill-chip">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
