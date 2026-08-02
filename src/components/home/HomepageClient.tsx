"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { LandingWorkCard } from "@/content/home";
import { landingPageContent } from "@/content/home";
import PortfolioSiteNav from "@/components/home/PortfolioSiteNav";

const homeSectionOrder = ["home", "work", "connect"] as const;

function EvidenceDiagram() {
  return (
    <div className="portfolio-evidence-board" aria-label="从研究到产品验证的工作方法">
      <div className="portfolio-board-head">
        <span>FIELD NOTE / 01</span>
        <span className="portfolio-board-status">
          <i aria-hidden="true" /> AVAILABLE FOR CONVERSATIONS
        </span>
      </div>

      <div className="portfolio-board-map" aria-hidden="true">
        <div className="portfolio-map-axis" />
        <span className="portfolio-map-node node-research">研究</span>
        <span className="portfolio-map-node node-structure">结构</span>
        <span className="portfolio-map-node node-build">实现</span>
        <span className="portfolio-map-node node-validate">验证</span>
        <div className="portfolio-map-line line-one" />
        <div className="portfolio-map-line line-two" />
        <div className="portfolio-map-line line-three" />
      </div>

      <div className="portfolio-board-metrics">
        <div>
          <span>基础</span>
          <strong>金融训练</strong>
        </div>
        <div>
          <span>方法</span>
          <strong>研究与拆解</strong>
        </div>
        <div>
          <span>结果</span>
          <strong>可运行产品</strong>
        </div>
      </div>
    </div>
  );
}

function WorkCardCover({ cover }: { cover: LandingWorkCard["cover"] }) {
  if (cover === "dashboard") {
    return (
      <div className="portfolio-cover portfolio-cover-dashboard">
        <Image
          src="/ai-enablement-cover-site.png"
          alt="项目经历与实践案例封面"
          fill
          sizes="(max-width: 760px) 100vw, 60vw"
          className="portfolio-cover-image"
          priority
        />
      </div>
    );
  }

  if (cover === "mailroom") {
    return (
      <div className="portfolio-cover portfolio-cover-paper">
        <Image
          src="/selected-builds-cover.png"
          alt="AI 产品评测与判断案例封面"
          fill
          sizes="(max-width: 760px) 100vw, 50vw"
          className="portfolio-cover-image portfolio-cover-contain"
        />
      </div>
    );
  }

  if (cover === "character") {
    return (
      <div className="portfolio-cover portfolio-cover-workflow">
        <Image
          src="/covers/ai-workflow-character.png"
          alt="AI 工作流与实践案例封面"
          fill
          sizes="(max-width: 760px) 100vw, 50vw"
          className="portfolio-cover-image portfolio-cover-contain"
        />
      </div>
    );
  }

  return (
    <div className="portfolio-cover portfolio-cover-abstract" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function WorkCard({ card, featured }: { card: LandingWorkCard; featured: boolean }) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.article
      className={`portfolio-work-card ${featured ? "is-featured" : ""}`}
      initial={false}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={card.href} className="portfolio-work-link">
        <div className="portfolio-work-visual">
          <WorkCardCover cover={card.cover} />
          <div className="portfolio-work-signal">
            <span>{card.index ?? "00"}</span>
            <strong>{card.signal ?? card.category}</strong>
          </div>
        </div>

        <div className="portfolio-work-copy">
          <div className="portfolio-work-category">
            <span>{card.category ?? "CASE STUDY"}</span>
            <span aria-hidden="true">↗</span>
          </div>
          <h3>{card.title}</h3>
          <p className="portfolio-work-subtitle">{card.subtitle}</p>
          {card.summary ? <p className="portfolio-work-summary">{card.summary}</p> : null}
          {card.meta ? <p className="portfolio-work-meta">{card.meta}</p> : null}
          {card.tags ? (
            <ul className="portfolio-work-tags" aria-label="项目标签">
              {card.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          ) : null}
          <span className="portfolio-work-cta">查看完整案例 <i aria-hidden="true">→</i></span>
        </div>
      </Link>
    </motion.article>
  );
}

export default function HomepageClient() {
  const reduceMotion = useReducedMotion() ?? false;
  const [activeSection, setActiveSection] = useState("home");
  const { hero, nav, work, connect } = landingPageContent;
  const visibleWorkCards = work.cards.filter((card) => !card.isDraft);
  const visibleConnectLinks = connect.links.filter(
    (link) => !("isDraft" in link && link.isDraft),
  );

  useEffect(() => {
    const sections = homeSectionOrder
      .map((sectionId) => document.getElementById(sectionId))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0.1, 0.3, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="portfolio-home">
      <a href="#main-content" className="portfolio-skip-link">跳到主要内容</a>
      <PortfolioSiteNav items={nav} activeSection={activeSection} />

      <main id="main-content">
      <section id="home" className="portfolio-hero section-frame">
        <motion.div
          className="portfolio-hero-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.58, ease: [0.18, 0.9, 0.22, 1] }}
        >
          <div className="portfolio-hero-kicker">
            <span className="portfolio-kicker-line" aria-hidden="true" />
            <p>{hero.eyebrow}</p>
          </div>
          <h1>
            {hero.title.map((line, index) => (
              <span key={line} className={index === 1 ? "is-accent" : undefined}>
                {line}
              </span>
            ))}
          </h1>
          <p className="portfolio-hero-summary">{hero.summary}</p>
          <div className="portfolio-hero-actions">
            <Link href="/#work" className="portfolio-primary-action">
              浏览项目 <span aria-hidden="true">↓</span>
            </Link>
            <a href="/resume.pdf" className="portfolio-text-action">
              下载简历 <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="portfolio-hero-signature">
            <strong>{hero.name}</strong>
            <span>{hero.note}</span>
          </div>
        </motion.div>

        <motion.div
          className="portfolio-hero-evidence"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.62, ease: [0.18, 0.9, 0.22, 1], delay: 0.08 }}
        >
          <EvidenceDiagram />
        </motion.div>
      </section>

      <section id="work" className="portfolio-work-section section-frame">
        <div className="portfolio-section-heading">
          <div>
            <p className="portfolio-section-index">02 / WORK</p>
            <h2>{work.eyebrow}</h2>
          </div>
          <p>{work.note}</p>
        </div>

        <div className="portfolio-work-grid">
          {visibleWorkCards.map((card, index) => (
            <WorkCard key={card.slug} card={card} featured={index === 0} />
          ))}
        </div>
      </section>

      <section id="connect" className="portfolio-connect-section section-frame">
        <div className="portfolio-connect-main">
          <p className="portfolio-section-index">03 / CONNECT</p>
          <h2>{connect.title}</h2>
          <p>{connect.summary}</p>
          <a href={connect.cta.href} className="portfolio-primary-action">
            {connect.cta.label} <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="portfolio-contact-list">
          {visibleConnectLinks.map((link) => {
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="portfolio-contact-link"
              >
                <span>{link.label}</span>
                <strong>{link.value}</strong>
                <i aria-hidden="true">↗</i>
              </a>
            );
          })}
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
