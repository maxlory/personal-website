import { notFound } from "next/navigation";
import DetailPageFrame from "@/components/home/DetailPageFrame";
import { getWorkCaseBySlug } from "@/content/home";
import ResumeCaseContent from "@/components/home/ResumeCaseContent";
import SelectedBuildsCaseContent from "@/components/home/SelectedBuildsCaseContent";
import AiWorkflowCaseContent from "@/components/home/AiWorkflowCaseContent";
import FinanceSkillsCaseContent from "@/components/home/FinanceSkillsCaseContent";
import DevelopHarnessCaseContent from "@/components/home/DevelopHarnessCaseContent";

export async function generateStaticParams() {
  return [
    { slug: "futures-ai" },
    { slug: "ai-benchmark" },
    { slug: "selected-builds" },
    { slug: "finance-skills" },
    { slug: "develop-harness" },
  ];
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workCase = getWorkCaseBySlug(slug);

  if (!workCase) {
    notFound();
  }

  if (workCase.kind === "resume") {
    return (
      <DetailPageFrame
        active="Work"
        eyebrow={workCase.eyebrow}
        title={workCase.title}
        subtitle={workCase.subtitle}
        note={workCase.heroNote}
      >
        <ResumeCaseContent caseData={workCase} />
      </DetailPageFrame>
    );
  }

  if (workCase.kind === "selected-builds") {
    return (
      <DetailPageFrame
        active="Work"
        eyebrow={workCase.eyebrow}
        title={workCase.title}
        subtitle={workCase.subtitle}
        note={workCase.heroNote}
      >
        <SelectedBuildsCaseContent caseData={workCase} />
      </DetailPageFrame>
    );
  }

  if (workCase.kind === "ai-workflow") {
    return (
      <DetailPageFrame
        active="Work"
        eyebrow={workCase.eyebrow}
        title={workCase.title}
        subtitle={workCase.subtitle}
        note={workCase.heroNote}
      >
        <AiWorkflowCaseContent caseData={workCase} />
      </DetailPageFrame>
    );
  }

  if (workCase.kind === "finance-skills") {
    return (
      <DetailPageFrame
        active="Work"
        eyebrow={workCase.eyebrow}
        title={workCase.title}
        subtitle={workCase.subtitle}
        note={workCase.heroNote}
      >
        <FinanceSkillsCaseContent caseData={workCase} />
      </DetailPageFrame>
    );
  }

  if (workCase.kind === "develop-harness") {
    return (
      <DetailPageFrame
        active="Work"
        eyebrow={workCase.eyebrow}
        title={workCase.title}
        subtitle={workCase.subtitle}
        note={workCase.heroNote}
      >
        <DevelopHarnessCaseContent caseData={workCase} />
      </DetailPageFrame>
    );
  }

  return (
    <DetailPageFrame
      active="Work"
      eyebrow={workCase.eyebrow}
      title={workCase.title}
      subtitle={workCase.subtitle}
      note={workCase.heroNote}
    >
      <div className="detail-stack">
        <article className="detail-panel detail-panel-paper detail-summary">
          <p className="detail-body">{workCase.summary}</p>
        </article>

        {workCase.stats?.length ? (
          <div className="detail-stats-grid">
            {workCase.stats.map((stat) => (
              <div key={stat.label} className="detail-stat">
                <span className="detail-stat-label">{stat.label}</span>
                <span className="detail-stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="detail-grid detail-grid-work">
          {workCase.detailSections.map((section, index) => (
            <article
              key={section.title}
              className={`detail-panel ${index === 1 ? "detail-panel-deep" : "detail-panel-paper"}`}
            >
              <p className={`section-kicker ${index === 1 ? "text-white/68" : ""}`}>
                {section.title}
              </p>
              <p className={`detail-body ${index === 1 ? "text-white/76" : ""}`}>
                {section.body}
              </p>
            </article>
          ))}
        </div>

        <article className="detail-panel detail-panel-clay detail-callout">
          <p className="detail-callout-text">{workCase.callout}</p>
        </article>
      </div>
    </DetailPageFrame>
  );
}
