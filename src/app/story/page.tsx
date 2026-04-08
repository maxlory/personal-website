import DetailPageFrame from "@/components/home/DetailPageFrame";
import { storyPage } from "@/content/home";

export default function StoryPage() {
  return (
    <DetailPageFrame
      active="Story"
      eyebrow="Story"
      title={storyPage.title}
      subtitle={storyPage.subtitle}
      note={storyPage.intro}
    >
      <div className="detail-grid detail-grid-story">
        {storyPage.sections.map((section, index) => (
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
    </DetailPageFrame>
  );
}
