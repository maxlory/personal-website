"use client";

import Image from "next/image";
import Link from "next/link";
import type {
  LandingDevelopCover,
  LandingFinanceCover,
  LandingWorkCard,
} from "@/content/home";

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
  onActivate,
}: {
  card: LandingWorkCard;
  onActivate: (slug: string | null) => void;
}) {
  return (
    <li className={`ei-project-cell placement-${card.role}`}>
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
    </li>
  );
}
