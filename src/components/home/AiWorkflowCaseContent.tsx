import Image from "next/image";
import type {
  AiWorkflowEvidenceAsset,
  AiWorkflowWorkCase,
} from "@/content/home";

function EvidenceMedia({ asset }: { asset: AiWorkflowEvidenceAsset }) {
  if (asset.kind === "image") {
    return (
      <Image
        src={asset.src}
        alt={asset.alt ?? asset.caption}
        width={asset.width ?? 1600}
        height={asset.height ?? 900}
        sizes="(max-width: 959px) 100vw, 44vw"
        className="ai-workflow-evidence-image"
      />
    );
  }

  return (
    <video
      className="ai-workflow-evidence-video"
      controls
      playsInline
      preload="none"
      aria-label={asset.title}
      poster={asset.poster}
    >
      <source src={asset.src} type={asset.mimeType ?? "video/mp4"} />
      Your browser does not support the video tag.
    </video>
  );
}

export default function AiWorkflowCaseContent({
  caseData,
}: {
  caseData: AiWorkflowWorkCase;
}) {
  return (
    <div className="detail-stack ai-workflow-stack">
      <section className="detail-panel detail-panel-paper ai-workflow-overview">
        <div className="ai-workflow-overview-copy">
          <p className="section-kicker">Overview</p>
          <p className="detail-body ai-workflow-overview-text">
            {caseData.overview}
          </p>
        </div>
        <div className="ai-workflow-overview-note">
          <span>Core signal</span>
          <strong>from vibe coding to working systems</strong>
        </div>
      </section>

      <div className="detail-stats-grid ai-workflow-stats-grid">
        {caseData.stats.map((stat) => (
          <div key={stat.label} className="detail-stat">
            <span className="detail-stat-label">{stat.label}</span>
            <span className="detail-stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      <section className="ai-workflow-projects">
        <div className="ai-workflow-section-head">
          <p className="section-kicker">Case dossiers</p>
          <h2 className="detail-panel-title ai-workflow-section-title">
            两个项目，两个重点
          </h2>
        </div>

        <div className="ai-workflow-project-grid">
          {caseData.projects.map((project) => (
            <article
              key={project.title}
              className="detail-panel detail-panel-paper ai-workflow-project-card"
            >
              <div className="ai-workflow-project-head">
                <div>
                  <p className="section-kicker">{project.label}</p>
                  <h3>{project.title}</h3>
                </div>
                <span>{project.focus}</span>
              </div>

              <p className="ai-workflow-project-summary">{project.summary}</p>

              {project.process?.length ? (
                <div className="ai-workflow-process-card">
                  <div className="ai-workflow-process-head">
                    <p className="section-kicker">Build process</p>
                    <h4>{project.processHeading ?? "具体构建流程"}</h4>
                  </div>

                  <ol className="ai-workflow-process-list">
                    {project.process.map((step, index) => (
                      <li key={step.title} className="ai-workflow-process-item">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <h5>{step.title}</h5>
                          <p>{step.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              {project.evidence?.length ? (
                <div className="ai-workflow-project-evidence-grid">
                  {project.evidence.map((asset) => (
                    <figure
                      key={asset.title}
                      className="ai-workflow-project-evidence-card"
                    >
                      <div className="ai-workflow-project-evidence-media">
                        <EvidenceMedia asset={asset} />
                      </div>
                      <figcaption>
                        <span>{asset.label}</span>
                        <strong>{asset.title}</strong>
                        <p>{asset.caption}</p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}

              {project.prdWindow ? (
                <div className="ai-workflow-prd-window">
                  <div className="ai-workflow-prd-window-head">
                    <div>
                      <p className="section-kicker">PRD window</p>
                      <h4>{project.prdWindow.title}</h4>
                      <span>{project.prdWindow.sourceLabel}</span>
                    </div>
                    <a href={project.prdWindow.downloadHref} download>
                      下载原文
                    </a>
                  </div>
                  <pre>{project.prdWindow.content}</pre>
                </div>
              ) : null}

              {project.proofPoints.length ? (
                <div className="ai-workflow-proof-list">
                  <p>Proof points</p>
                  <ul>
                    {project.proofPoints.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {project.closingJudgment ? (
                <div className="ai-workflow-project-verdict">
                  <span>What it proves</span>
                  <strong>{project.closingJudgment}</strong>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="ai-workflow-evidence-section">
        <div className="ai-workflow-section-head">
          <p className="section-kicker">Evidence strip</p>
          <h2 className="detail-panel-title ai-workflow-section-title">
            证据墙
          </h2>
        </div>

        <div className="ai-workflow-evidence-grid">
          {caseData.evidence.map((asset) => (
            <article
              key={asset.title}
              className="detail-panel detail-panel-paper ai-workflow-evidence-card"
            >
              <div className="ai-workflow-evidence-media">
                <EvidenceMedia asset={asset} />
              </div>
              <div className="ai-workflow-evidence-copy">
                <span>{asset.label}</span>
                <h3>{asset.title}</h3>
                <p>{asset.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
