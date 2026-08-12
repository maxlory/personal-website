"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { DevelopRole } from "@/content/develop-harness";

/**
 * PW-04 four-role control plane (design-spec section 8, AC-D03, AC-D04,
 * AC-G04, AC-G05, AC-G07).
 *
 * 主会话 / Sol holds the gate, DeepSeek is the single writer, Terra and Luna
 * are the review/verification branches. Selecting a role reveals 负责环节,
 * 收到, 交回, 写入权限 and the role's evidence status. Contract and observed
 * evidence stay distinct: Terra is never shown as having run RA-06.
 *
 * The role stack is keyboard operable (focus + Enter/Space activate a role;
 * Arrow keys rove selection) and the detail reveal is an explicit 200ms
 * opacity/short-translate that becomes immediate under
 * prefers-reduced-motion.
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

export default function DevelopRoles({ roles }: { roles: DevelopRole[] }) {
  const [selected, setSelected] = useState(0);
  const reduceMotion = usePrefersReducedMotion();
  const roleRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    setSelected(index);
    roleRefs.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const count = roles.length;
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

  const role = roles[selected];
  const panelId = "develop-role-panel";
  const detail = (
    <>
      <span
        className={`develop-evidence-state ${
          role.evidence === "proven" ? "is-proven" : "is-contract"
        }`}
      >
        {role.status}
      </span>
      <h3>{role.name}</h3>
      <p className="develop-role-summary">{role.summary}</p>
      <dl className="develop-role-facts">
        <div className="develop-role-fact">
          <dt>负责环节</dt>
          <dd>{role.phases}</dd>
        </div>
        <div className="develop-role-fact">
          <dt>收到</dt>
          <dd>{role.receives}</dd>
        </div>
        <div className="develop-role-fact">
          <dt>交回</dt>
          <dd>{role.returns}</dd>
        </div>
        <div className="develop-role-fact">
          <dt>写入权限</dt>
          <dd>{role.writing}</dd>
        </div>
      </dl>
    </>
  );

  return (
    <div className="develop-roles" data-develop-roles>
      <div
        className="develop-role-list"
        role="group"
        aria-label="四个执行角色"
        onKeyDown={onKeyDown}
      >
        {roles.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => {
              roleRefs.current[index] = element;
            }}
            type="button"
            id={`develop-role-tab-${item.id}`}
            aria-current={selected === index ? "true" : undefined}
            aria-controls={panelId}
            tabIndex={selected === index ? 0 : -1}
            className={`develop-role-button ${
              item.id === "main" ? "is-controller" : ""
            }`}
            onClick={() => select(index)}
          >
            <small>{item.kicker}</small>
            <b>{item.name}</b>
            <p>{item.buttonSummary}</p>
            {item.buttonStatus ? (
              <em
                className={
                  item.evidence === "proven" ? "is-proven" : "is-contract"
                }
              >
                {item.buttonStatus}
              </em>
            ) : null}
          </button>
        ))}
      </div>

      {reduceMotion ? (
        <div
          className="develop-role-detail"
          id={panelId}
          aria-labelledby={`develop-role-tab-${role.id}`}
          aria-live="polite"
        >
          {detail}
        </div>
      ) : (
        <motion.div
          key={role.id}
          className="develop-role-detail"
          id={panelId}
          aria-labelledby={`develop-role-tab-${role.id}`}
          aria-live="polite"
          initial={{ opacity: 0.55, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          {detail}
        </motion.div>
      )}
    </div>
  );
}
