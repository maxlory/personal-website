import type { Metadata } from "next";
import Link from "next/link";
import DetailPageFrame from "@/components/home/DetailPageFrame";
import { processPage } from "@/content/home";

export const metadata: Metadata = {
  title: "工作方法 | 苏天润",
  description: "先定义问题，再建立可执行结构，最后通过原型、测试和真实运行验证判断。",
  alternates: { canonical: "/process" },
  openGraph: { url: "/process", images: ["/og.png"] },
};

export default function ProcessPage() {
  return (
    <DetailPageFrame
      active="Process"
      eyebrow="02 / PROCESS"
      title="先把问题想清楚，再把判断做出来。"
      subtitle={processPage.subtitle}
      note={processPage.intro}
    >
      <div className="portfolio-process-layout">
        <section aria-labelledby="process-steps-title">
          <div className="portfolio-content-heading">
            <p className="portfolio-section-index">WORKING METHOD / 方法</p>
            <h2 id="process-steps-title">三个阶段，把模糊问题推进到可验证结果。</h2>
          </div>

          <ol className="portfolio-process-steps">
            {processPage.steps.map((step, index) => (
              <li key={step.title} className="portfolio-process-step">
                <div className="portfolio-process-step-head">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{index === 0 ? "FRAME" : index === 1 ? "STRUCTURE" : "VALIDATE"}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="portfolio-process-principle" aria-labelledby="process-principle-title">
          <div>
            <p className="portfolio-section-index">OPERATING PRINCIPLE</p>
            <h2 id="process-principle-title">证据先于包装，边界先于功能。</h2>
          </div>
          <div>
            <p>
              不把完整的表达误当成可靠的结果。面对研究、评测或产品方案，我会先说明证据、限制与判断口径，再决定要做什么。
            </p>
            <Link href="/work/selected-builds">在评测案例中查看这个方法 <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </div>
    </DetailPageFrame>
  );
}
