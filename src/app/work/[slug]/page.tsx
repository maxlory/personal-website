import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import DetailPageFrame from "@/components/home/DetailPageFrame";
import { getWorkCaseBySlug } from "@/content/home";
import ResumeCaseContent from "@/components/home/ResumeCaseContent";
import SelectedBuildsCaseContent from "@/components/home/SelectedBuildsCaseContent";
import AiWorkflowCaseContent from "@/components/home/AiWorkflowCaseContent";

export async function generateStaticParams() {
  return [
    { slug: "profile" },
    { slug: "ai-workflow" },
    { slug: "selected-builds" },
    { slug: "futures-ai" },
    { slug: "ai-benchmark" },
  ];
}

const legacySlugs: Record<string, string> = {
  "futures-ai": "profile",
  "ai-benchmark": "ai-workflow",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSlug = legacySlugs[slug] ?? slug;
  const workCase = getWorkCaseBySlug(resolvedSlug);

  if (!workCase) return {};

  const pageTitle =
    workCase.kind === "resume" ? "个人经历与项目实践" : workCase.title;

  return {
    title: `${pageTitle} | 苏天润`,
    description: `${workCase.subtitle}。${workCase.heroNote}`,
    alternates: { canonical: `/work/${resolvedSlug}` },
    openGraph: {
      title: `${pageTitle} | 苏天润`,
      description: workCase.subtitle,
      url: `/work/${resolvedSlug}`,
      images: ["/og.png"],
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (legacySlugs[slug]) {
    permanentRedirect(`/work/${legacySlugs[slug]}`);
  }

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
              <h2 className={`section-kicker ${index === 1 ? "text-white/68" : ""}`}>
                {section.title}
              </h2>
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
