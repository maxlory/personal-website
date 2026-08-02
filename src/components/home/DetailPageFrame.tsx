import Link from "next/link";
import type { ReactNode } from "react";
import { siteNav } from "@/content/home";
import PortfolioSiteNav from "@/components/home/PortfolioSiteNav";

const activeSectionMap = {
  Work: "work",
  Story: "story",
  Process: "process",
} as const;

const pageSignals = {
  Work: ["问题与角色", "方法与过程", "证据与判断"],
  Story: ["金融训练", "产品实践", "当前方向"],
  Process: ["定义问题", "建立结构", "验证判断"],
} as const;

export default function DetailPageFrame({
  active,
  eyebrow,
  title,
  subtitle,
  note,
  children,
}: {
  active: "Work" | "Story" | "Process";
  eyebrow: string;
  title: string;
  subtitle: string;
  note?: string;
  children: ReactNode;
}) {
  const activeSection = activeSectionMap[active];

  return (
    <div className="portfolio-home portfolio-detail-page">
      <a href="#main-content" className="portfolio-skip-link">跳到主要内容</a>
      <PortfolioSiteNav items={siteNav} activeSection={activeSection} />

      <main id="main-content">
      <section className="portfolio-detail-hero section-frame">
        <div className="portfolio-detail-crumb">
          <span>{active === "Work" ? "CASE STUDY" : "PROFILE NOTE"}</span>
          <span>SU TIANRUN / 2026</span>
        </div>

        <div className="portfolio-detail-hero-grid">
          <div className="portfolio-detail-hero-copy">
            <p className="portfolio-section-index">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="portfolio-detail-subtitle">{subtitle}</p>
            {note ? <p className="portfolio-detail-note">{note}</p> : null}
          </div>

          <aside className="portfolio-detail-signal" aria-label="本页阅读结构">
            <div className="portfolio-detail-signal-head">
              <span>READING SIGNAL</span>
              <span aria-hidden="true">↘</span>
            </div>
            <ol>
              {pageSignals[active].map((signal, index) => (
                <li key={signal}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{signal}</strong>
                </li>
              ))}
            </ol>
            <Link href="/#work">返回项目总览 <span aria-hidden="true">↗</span></Link>
          </aside>
        </div>
      </section>

      <section className="section-frame portfolio-detail-content">{children}</section>

      <section className="section-frame portfolio-detail-contact">
        <div>
          <p className="portfolio-section-index">CONTINUE THE CONVERSATION</p>
          <h2>有值得认真对待的问题，欢迎一起聊聊。</h2>
        </div>
        <div className="portfolio-detail-contact-actions">
          <a href="mailto:sutianrun@ucass.com" className="portfolio-primary-action">
            联系我 <span aria-hidden="true">↗</span>
          </a>
          <Link href="/#work" className="portfolio-text-action">
            查看其他项目 <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      </main>

      <footer className="portfolio-footer section-frame">
        <span>SU TIANRUN © 2026</span>
        <span>Research clearly. Build deliberately.</span>
      </footer>
    </div>
  );
}
