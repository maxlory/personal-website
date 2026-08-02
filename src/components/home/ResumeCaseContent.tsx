import type { ResumeWorkCase } from "@/content/home";

export default function ResumeCaseContent({
  caseData,
}: {
  caseData: ResumeWorkCase;
}) {
  return (
    <div className="detail-stack detail-resume-stack">
      <section className="detail-panel detail-panel-paper resume-overview-card">
        <div className="resume-overview-grid">
          <div className="resume-overview-copy">
            <p className="section-kicker">Overview</p>
            <p className="resume-overview-summary">{caseData.overview.summary}</p>
            <p className="resume-overview-direction">
              {caseData.overview.direction}
            </p>

            <div className="resume-overview-detail-list">
              {caseData.overview.details.map((item) => (
                <div key={item.label} className="resume-overview-detail-item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="resume-overview-side">
            <a
              href={caseData.overview.pdf.href}
              download
              className="resume-download-button"
            >
              {caseData.overview.pdf.label}
            </a>

            <div className="resume-contact-list">
              {caseData.overview.contacts.map((contact) =>
                contact.href ? (
                  <a
                    key={contact.label}
                    href={contact.href}
                    className="resume-contact-item"
                    target={contact.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      contact.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    <span>{contact.label}</span>
                    <strong>{contact.value}</strong>
                  </a>
                ) : (
                  <div key={contact.label} className="resume-contact-item">
                    <span>{contact.label}</span>
                    <strong>{contact.value}</strong>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="resume-section-block">
        <div className="resume-section-heading">
          <p className="section-kicker">Project Experience</p>
          <h2 className="detail-panel-title resume-section-title">项目经历</h2>
        </div>

        <div className="resume-project-list">
          {caseData.highlights.map((highlight, index) => (
            <article key={highlight.title} className="resume-project-item">
              <div className="resume-project-index">0{index + 1}</div>
              <div className="resume-project-copy">
                <h3 className="resume-project-title">{highlight.title}</h3>
                <p className="resume-project-body">{highlight.body}</p>
                <p className="resume-project-detail">{highlight.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="resume-section-block">
        <div className="resume-section-heading">
          <p className="section-kicker">Resume PDF</p>
          <h2 className="detail-panel-title resume-section-title">
            {caseData.pdfEmbed.title}
          </h2>
          <p className="resume-pdf-note">{caseData.pdfEmbed.note}</p>
        </div>

        <div className="detail-panel detail-panel-paper resume-pdf-shell">
          <iframe
            src={caseData.pdfEmbed.href}
            title={caseData.pdfEmbed.title}
            className="resume-pdf-frame"
            loading="lazy"
          />
          <p className="resume-pdf-fallback">
            如果浏览器无法预览，请
            <a href={caseData.pdfEmbed.href} target="_blank" rel="noopener noreferrer">
              打开完整 PDF
            </a>
            。
          </p>
        </div>
      </section>
    </div>
  );
}
