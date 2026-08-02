import type { Metadata } from "next";
import Link from "next/link";
import DetailPageFrame from "@/components/home/DetailPageFrame";
import { storyPage } from "@/content/home";

export const metadata: Metadata = {
  title: "关于我 | 苏天润",
  description: "从金融训练、研究实践到 AI 产品与工作流落地：苏天润的学习与实践路径。",
  alternates: { canonical: "/story" },
  openGraph: { url: "/story", images: ["/og.png"] },
};

export default function StoryPage() {
  return (
    <DetailPageFrame
      active="Story"
      eyebrow="01 / STORY"
      title="一条从金融研究走向 AI 产品的路径。"
      subtitle={storyPage.subtitle}
      note={storyPage.intro}
    >
      <div className="portfolio-story-layout">
        <section className="portfolio-story-timeline" aria-labelledby="story-timeline-title">
          <div className="portfolio-content-heading">
            <p className="portfolio-section-index">BACKGROUND / 背景</p>
            <h2 id="story-timeline-title">经历不是清单，而是一条能力形成的线。</h2>
          </div>

          <div className="portfolio-story-list">
            {storyPage.sections.map((section, index) => (
              <article key={section.title} className="portfolio-story-item">
                <span className="portfolio-story-index">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{section.title}</h3>
                  <p>{section.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="portfolio-story-focus" aria-labelledby="story-focus-title">
          <p className="portfolio-section-index">CURRENT FOCUS</p>
          <h2 id="story-focus-title">现在，我把注意力放在这些交叉点上。</h2>
          <ul>
            <li><span>01</span><strong>AI 产品与金融场景</strong></li>
            <li><span>02</span><strong>研究框架与产品判断</strong></li>
            <li><span>03</span><strong>工作流与真实交付</strong></li>
          </ul>
          <Link href="/process">查看我的工作方法 <span aria-hidden="true">→</span></Link>
        </aside>
      </div>
    </DetailPageFrame>
  );
}
