"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type {
  LandingDevelopCover,
  LandingFinanceCover,
  LandingWorkCard,
} from "@/content/home";
import { useHydrated } from "./useHydrated";

function Cover({
  cover,
  coverData,
}: {
  cover: LandingWorkCard["cover"];
  coverData?: LandingWorkCard["coverData"];
}) {
  if (cover === "dashboard") {
    return (
      <div className="ei-project-cover ei-project-cover-dashboard">
        <Image
          src="/ai-enablement-cover-site.png"
          alt=""
          fill
          sizes="(max-width: 899px) 100vw, 42vw"
          className="ei-project-cover-image"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (cover === "mailroom") {
    return (
      <div className="ei-project-cover ei-project-cover-mailroom">
        <Image
          src="/selected-builds-cover.png"
          alt=""
          fill
          sizes="(max-width: 899px) 100vw, 52vw"
          className="ei-project-cover-image ei-project-cover-mailroom-backdrop"
          aria-hidden="true"
        />
        <Image
          src="/selected-builds-cover.png"
          alt=""
          fill
          sizes="(max-width: 899px) 100vw, 52vw"
          className="ei-project-cover-image ei-project-cover-mailroom-main"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (cover === "character") {
    return (
      <div className="ei-project-cover ei-project-cover-character">
        <Image
          src="/covers/ai-workflow-character.png"
          alt=""
          fill
          sizes="(max-width: 899px) 100vw, 42vw"
          className="ei-project-cover-image ei-project-cover-character-backdrop"
          aria-hidden="true"
        />
        <div className="ei-project-cover-character-foreground">
          <Image
            src="/covers/ai-workflow-character.png"
            alt=""
            fill
            sizes="(max-width: 899px) 100vw, 36vw"
            className="ei-project-cover-image"
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }

  if (cover === "systems") {
    const data = coverData as LandingDevelopCover | undefined;
    const nodes = data?.nodes ?? [
      { index: "01", name: "Intent", note: "用户目标" },
      { index: "02", name: "Build", note: "Subagent 实现" },
      { index: "03", name: "Review", note: "独立检查" },
      { index: "04", name: "Verify", note: "证据验证" },
    ];
    return (
      <div className="ei-project-cover ei-project-cover-systems">
        <ol className="ei-develop-chain" aria-label="Develop 协作链">
          {nodes.map((node) => (
            <li key={node.name} className="ei-develop-chain-node">
              <span className="ei-develop-chain-index" aria-hidden="true">
                {node.index}
              </span>
              <b>{node.name}</b>
              <small>{node.note}</small>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const data = coverData as LandingFinanceCover | undefined;
  const metrics = data?.metrics ?? ["7 环节", "30 Skills", "月末财务包"];
  const headers =
    data?.headers ?? ["原始日期", "标准日期", "标准金额", "状态"];
  const rows =
    data?.rows ?? [
      ["二月初八", "2026-03-26", "10,800", "medium / high"],
      ["初十八", "空", "15,000", "needs_review"],
    ];
  return (
    <div className="ei-project-cover ei-project-cover-ledger">
      <div className="ei-ledger-sheet">
        <div className="ei-ledger-sheet-head">
          <b>{data?.label ?? "月末财务包"}</b>
          <span>{data?.sheetName ?? "Sheet 01 · 清洗与置信度"}</span>
        </div>
        <table className="ei-ledger-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ei-ledger-foot">
          {metrics.map((metric) => (
            <span key={metric}>{metric}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectIndexCard({
  card,
  index,
  onActivate,
}: {
  card: LandingWorkCard;
  index: number;
  onActivate: (slug: string | null) => void;
}) {
  const cardRef = useRef<HTMLLIElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px 0px" });
  const reducedMotion = Boolean(useReducedMotion());
  const staticMotion = useHydrated() && reducedMotion;
  const isVisible = isInView || staticMotion;
  const animationProps = staticMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95, y: 24 },
        animate: isVisible
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.95, y: 24 },
        transition: {
          duration: 0.68,
          delay: index * 0.15,
          ease: [0.22, 1, 0.36, 1] as const,
        },
      };

  const cardClassName = `ei-project-cell placement-${card.role} ${isVisible ? "is-visible" : ""}`;
  const cardContent = (
      <Link
        href={card.href}
        data-project-role={card.role}
        className="ei-project-card"
        aria-label={`${card.title}，${card.type}，${card.outcome}`}
        onMouseEnter={() => onActivate(card.slug)}
        onMouseLeave={() => onActivate(null)}
        onFocus={() => onActivate(card.slug)}
        onBlur={() => onActivate(null)}
      >
        <span className="ei-project-index" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="ei-project-cover" aria-hidden="true">
          <Cover cover={card.cover} coverData={card.coverData} />
        </div>
        <div className="ei-project-meta">
          <p className="ei-project-type">{card.type}</p>
          <h3 className="ei-project-title">{card.title}</h3>
          <p className="ei-project-outcome">{card.outcome}</p>
        </div>
        <span className="ei-project-arrow" aria-hidden="true">
          ↗
        </span>
      </Link>
  );

  if (staticMotion) {
    return (
      <li ref={cardRef} className={cardClassName}>
        {cardContent}
      </li>
    );
  }

  return (
    <motion.li ref={cardRef} className={cardClassName} {...animationProps}>
      {cardContent}
    </motion.li>
  );
}
