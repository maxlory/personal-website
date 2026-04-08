import DetailPageFrame from "@/components/home/DetailPageFrame";
import { processPage } from "@/content/home";

export default function ProcessPage() {
  return (
    <DetailPageFrame
      active="Process"
      eyebrow="Process"
      title={processPage.title}
      subtitle={processPage.subtitle}
      note={processPage.intro}
    >
      <div className="detail-grid detail-grid-process">
        {processPage.steps.map((step, index) => (
          <article
            key={step.title}
            className={`detail-panel ${index === 1 ? "detail-panel-clay" : "detail-panel-paper"}`}
          >
            <p className="detail-step-index">0{index + 1}</p>
            <h2 className="detail-panel-title">{step.title}</h2>
            <p className="detail-body">{step.body}</p>
          </article>
        ))}
      </div>
    </DetailPageFrame>
  );
}
