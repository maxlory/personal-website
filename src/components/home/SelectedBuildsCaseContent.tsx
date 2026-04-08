/* eslint-disable @next/next/no-img-element */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  type SelectedBuildsProductDossier,
  type SelectedBuildsWorkCase,
} from "@/content/selected-builds";
import {
  getSelectedBuildsAppendixDocs,
  getSelectedBuildsNavigationGroups,
  type SelectedBuildsAppendixDocWithContent,
} from "@/lib/selected-builds";
import SelectedBuildsNavigator from "@/components/home/SelectedBuildsNavigator";

function MarkdownBlock({
  doc,
}: {
  doc: SelectedBuildsAppendixDocWithContent;
}) {
  if (!doc.content) {
    return null;
  }

  return (
    <details
      id={doc.anchorId}
      className="selected-doc"
      open={!doc.defaultCollapsed}
    >
      <summary className="selected-doc-summary">
        <div>
          <div className="selected-doc-label-row">
            <span className="selected-doc-type">{doc.docType}</span>
          </div>
          <h4 className="selected-doc-title">{doc.title}</h4>
        </div>
        <span className="selected-doc-toggle">展开原文</span>
      </summary>

      <div className="selected-doc-markdown">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a({ href, children }) {
              if (!href) {
                return <span>{children}</span>;
              }

              if (href.startsWith("/Users/")) {
                return <code className="selected-doc-local-link">{children}</code>;
              }

              const external = href.startsWith("http://") || href.startsWith("https://");

              return (
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                >
                  {children}
                </a>
              );
            },
            img({ src, alt }) {
              if (!src) {
                return null;
              }

              return (
                <img
                  src={src}
                  alt={alt ?? ""}
                  loading="lazy"
                  className="selected-doc-image"
                />
              );
            },
            table({ children }) {
              return (
                <div className="selected-doc-table-wrap">
                  <table>{children}</table>
                </div>
              );
            },
          }}
        >
          {doc.content}
        </ReactMarkdown>
      </div>
    </details>
  );
}

function DownloadDocCard({
  doc,
}: {
  doc: SelectedBuildsAppendixDocWithContent;
}) {
  return (
    <article className="selected-download-card">
      <div className="selected-doc-label-row">
        <span className="selected-doc-type">{doc.docType}</span>
      </div>

      <h4 className="selected-doc-title">{doc.title}</h4>
      <p className="selected-download-note">
        原始测试实录过长，不在页面内展开，保留 Markdown 下载以供完整查看。
      </p>

      <a
        href={`/work/selected-builds/download/${doc.downloadSlug}`}
        className="selected-download-link"
      >
        Download Markdown
      </a>
    </article>
  );
}

function DossierCard({ dossier }: { dossier: SelectedBuildsProductDossier }) {
  return (
    <section className="selected-dossier detail-panel detail-panel-paper">
      <div className="selected-dossier-head">
        <div>
          <p className="section-kicker">{dossier.label}</p>
          <h3 className="detail-panel-title selected-dossier-title">
            {dossier.product}
          </h3>
        </div>
        <p className="selected-dossier-summary">{dossier.summary}</p>
      </div>

      <div className="selected-dossier-sections">
        {dossier.sections.map((section) => (
          <article key={section.title} className="selected-dossier-section">
            <h4>{section.title}</h4>
            <p>{section.body}</p>
          </article>
        ))}
      </div>

      <div className="selected-dossier-columns">
        <div className="selected-dossier-list">
          <p className="selected-dossier-list-title">优势</p>
          <ul>
            {dossier.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="selected-dossier-list is-risk">
          <p className="selected-dossier-list-title">风险 / 短板</p>
          <ul>
            {dossier.risks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="selected-dossier-verdict">
        <span>一句话判断</span>
        <strong>{dossier.verdict}</strong>
      </div>
    </section>
  );
}

export default async function SelectedBuildsCaseContent({
  caseData,
}: {
  caseData: SelectedBuildsWorkCase;
}) {
  const appendixDocs = await getSelectedBuildsAppendixDocs();
  const navGroups = getSelectedBuildsNavigationGroups();
  const eastmoneyDocs = appendixDocs
    .filter((doc) => doc.product === "东方财富 Skills")
    .sort((a, b) => a.priority - b.priority);
  const windclawDocs = appendixDocs
    .filter((doc) => doc.product === "WindClaw")
    .sort((a, b) => a.priority - b.priority);

  return (
    <div className="detail-stack selected-builds-stack">
      <SelectedBuildsNavigator groups={navGroups} />

      <section className="selected-overview-grid">
        <article className="detail-panel detail-panel-paper detail-summary">
          <p className="section-kicker">Overview</p>
          <p className="detail-body">{caseData.summary}</p>
        </article>

        <article className="detail-panel detail-panel-paper detail-summary selected-role-card">
          <p className="section-kicker">My role</p>
          <p className="detail-body">{caseData.role}</p>
        </article>
      </section>

      <div className="detail-stats-grid selected-stats-grid">
        {caseData.stats.map((stat) => (
          <div key={stat.label} className="detail-stat">
            <span className="detail-stat-label">{stat.label}</span>
            <span className="detail-stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      <section
        id="comparison-overview"
        className="detail-panel detail-panel-paper selected-comparison-panel selected-anchor-section"
      >
        <div className="selected-section-head">
          <div>
            <p className="section-kicker">Comparison summary</p>
            <h2 className="detail-panel-title selected-section-title">对比总览</h2>
          </div>
          <div className="selected-comparison-winner">{caseData.comparison.winner}</div>
        </div>

        <p className="detail-body selected-section-body">{caseData.comparison.overview}</p>

        <div className="selected-insights-grid">
          {caseData.comparison.insights.map((insight) => (
            <article key={insight.title} className="selected-insight-card">
              <h3>{insight.title}</h3>
              <p>{insight.body}</p>
            </article>
          ))}
        </div>

        <div className="selected-final-judgment">
          <span>Final judgment</span>
          <strong>{caseData.comparison.finalJudgment}</strong>
        </div>
      </section>

      <section
        id="product-dossiers"
        className="selected-section-block selected-anchor-section"
      >
        <div className="selected-section-head">
          <div>
            <p className="section-kicker">Product dossiers</p>
            <h2 className="detail-panel-title selected-section-title">单产品拆解</h2>
          </div>
          <p className="selected-section-note">
            同样的结构，用来强调两款产品的能力边界、测试表现和最终判断。
          </p>
        </div>

        <div className="selected-dossier-grid">
          {caseData.dossiers.map((dossier) => (
            <div
              key={dossier.product}
              id={
                dossier.product === "东方财富 Skills"
                  ? "dossier-eastmoney"
                  : "dossier-windclaw"
              }
              className="selected-dossier-anchor"
            >
              <DossierCard dossier={dossier} />
            </div>
          ))}
        </div>
      </section>

      <section
        id="evaluation-method"
        className="detail-panel detail-panel-paper selected-method-panel selected-anchor-section"
      >
        <div className="selected-section-head">
          <div className="selected-method-headline">
            <p className="section-kicker selected-method-kicker">How I evaluated it</p>
            <h2 className="detail-panel-title selected-section-title selected-method-title">
              测试与评分方法
            </h2>
          </div>
        </div>

        <p className="detail-body selected-section-body selected-method-summary">
          {caseData.evaluation.summary}
        </p>

        <div className="selected-method-grid">
          {caseData.evaluation.sections.map((section) => (
            <article key={section.title} className="selected-method-card">
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="appendix"
        className="selected-section-block selected-anchor-section"
      >
        <div className="selected-section-head">
          <div>
            <p className="section-kicker">Appendix</p>
            <h2 className="detail-panel-title selected-section-title">原文附录</h2>
          </div>
          <p className="selected-section-note">{caseData.appendix.intro}</p>
        </div>

        <div className="selected-appendix-groups">
          {[
            {
              title: "东方财富 Skills",
              body: "产品深度分析和 28 题评分保留页内阅读，但默认折叠，原始测试实录改为下载查看。",
              docs: eastmoneyDocs,
            },
            {
              title: "WindClaw",
              body: "产品深度分析和 28 题评分保留页内阅读，但默认折叠，原始使用体验改为下载查看。",
              docs: windclawDocs,
            },
          ].map((group) => (
            <section key={group.title} className="detail-panel detail-panel-paper selected-appendix-group">
              <div className="selected-appendix-head">
                <div>
                  <p className="section-kicker">Appendix group</p>
                  <h3 className="detail-panel-title selected-dossier-title">
                    {group.title}
                  </h3>
                </div>
                <p className="selected-dossier-summary">{group.body}</p>
              </div>

              <div className="selected-doc-list">
                {group.docs.map((doc) =>
                  doc.renderMode === "inline" ? (
                    <MarkdownBlock key={`${doc.product}-${doc.docType}`} doc={doc} />
                  ) : (
                    <DownloadDocCard
                      key={`${doc.product}-${doc.docType}`}
                      doc={doc}
                    />
                  )
                )}
              </div>
            </section>
          ))}
        </div>
      </section>

      <article className="detail-panel detail-panel-paper selected-ending-card">
        <p className="section-kicker">What this case proves</p>
        <p className="detail-body">{caseData.callout}</p>
      </article>
    </div>
  );
}
