"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { SelectedBuildsNavItem } from "@/content/selected-builds";

type NavGroup = {
  label: SelectedBuildsNavItem["group"];
  items: SelectedBuildsNavItem[];
};

type StickyNavItem = {
  id: string;
  href: string;
  label: string;
  activeIds: string[];
};

const groupDisplayLabels: Record<NavGroup["label"], string> = {
  主内容: "案例主线",
  "东方财富 Skills": "东方财富 Skills",
  WindClaw: "WindClaw",
};

const mainContentDescriptions: Record<string, string> = {
  "comparison-overview": "谁更强、差在哪",
  "product-dossiers": "两款产品的能力边界与判断",
  "evaluation-method": "28题、4维评分、控制变量",
  appendix: "右侧查看深度分析、评分与下载",
};

function getCardDescription(item: SelectedBuildsNavItem) {
  if (item.group === "主内容") {
    return mainContentDescriptions[item.id] ?? item.title;
  }

  if (item.kind === "download") {
    return "下载完整 Markdown 原始材料";
  }

  return item.title.replace(`${item.group} / `, "");
}

export default function SelectedBuildsNavigator({
  groups,
}: {
  groups: NavGroup[];
}) {
  const anchorItems = useMemo(
    () => groups.flatMap((group) => group.items).filter((item) => item.kind === "anchor"),
    [groups]
  );
  const stickyItems = useMemo<StickyNavItem[]>(() => {
    const analysisAnchorIds = ["appendix-eastmoney-analysis", "appendix-windclaw-analysis"];
    const analysisAnchors = anchorItems.filter((item) => analysisAnchorIds.includes(item.id));
    const scoreAnchorIds = ["appendix-eastmoney-score", "appendix-windclaw-score"];
    const scoreAnchors = anchorItems.filter((item) => scoreAnchorIds.includes(item.id));

    return anchorItems.reduce<StickyNavItem[]>((items, item) => {
      if (analysisAnchorIds.includes(item.id)) {
        if (items.some((entry) => entry.id === "sticky-analysis-comparison") || analysisAnchors.length === 0) {
          return items;
        }

        return [
          ...items,
          {
            id: "sticky-analysis-comparison",
            href: analysisAnchors[0]?.href ?? "#appendix-eastmoney-analysis",
            label: "深度分析",
            activeIds: analysisAnchors.map((anchor) => anchor.id),
          },
        ];
      }

      if (scoreAnchorIds.includes(item.id)) {
        if (items.some((entry) => entry.id === "sticky-score-comparison") || scoreAnchors.length === 0) {
          return items;
        }

        return [
          ...items,
          {
            id: "sticky-score-comparison",
            href: scoreAnchors[0]?.href ?? "#appendix-eastmoney-score",
            label: "评分对比",
            activeIds: scoreAnchors.map((anchor) => anchor.id),
          },
        ];
      }

      return [
        ...items,
        {
          id: item.id,
          href: item.href,
          label: item.shortTitle,
          activeIds: [item.id],
        },
      ];
    }, []);
  }, [anchorItems]);
  const [activeSection, setActiveSection] = useState(anchorItems[0]?.id ?? "");

  useEffect(() => {
    const elements = anchorItems
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (elements.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0.2, 0.45, 0.7],
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [anchorItems]);

  return (
    <>
      <section className="selected-index-shell">
        <div className="selected-index-head">
          <p className="section-kicker">Case index</p>
          <h2 className="selected-index-title">从这里开始阅读</h2>
          <p className="selected-index-note">
            先看结论，再按需要下钻到单产品拆解、测试方法和附录材料。
          </p>
        </div>

        <div className="selected-index-groups">
          {groups.map((group) => (
            <div key={group.label} className="selected-index-group">
              <p className="selected-index-group-label">{groupDisplayLabels[group.label]}</p>
              <div className="selected-index-links">
                {group.items.map((item) => {
                  const isActive = item.kind === "anchor" && item.id === activeSection;
                  const className = [
                    "selected-index-link",
                    item.kind === "download" ? "is-download" : "",
                    isActive ? "is-active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return item.kind === "download" ? (
                    <a key={item.id} href={item.href} className={className}>
                      <span>{item.shortTitle}</span>
                      <small>{getCardDescription(item)}</small>
                    </a>
                  ) : (
                    <Link key={item.id} href={item.href} className={className}>
                      <span>{item.shortTitle}</span>
                      <small>{getCardDescription(item)}</small>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <nav className="selected-sticky-nav" aria-label="Selected Builds sections">
        <div className="selected-sticky-track">
          {stickyItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`selected-sticky-link ${item.activeIds.includes(activeSection) ? "is-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
