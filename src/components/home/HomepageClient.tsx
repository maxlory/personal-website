"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { LandingNavItem } from "@/content/home";
import { landingPageContent } from "@/content/home";
import type { TokscaleUsageData } from "@/lib/tokscale/data";
import { ProjectIndex } from "./ProjectIndex";
import { TokscaleUsageSection } from "./tokscale/TokscaleUsageSection";
import { WordsPullUp } from "./WordsPullUp";
import { useHydrated } from "./useHydrated";

const HERO_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4";

function HomeNav({ items }: { items: readonly LandingNavItem[] }) {
  return (
    <header className="ei-nav">
      <Link href="/#home" className="ei-nav-brand">
        SU TIANRUN
      </Link>
      <nav className="ei-nav-links" aria-label="Main">
        {items.map((item) => {
          const isMail = item.href.startsWith("mailto:");
          const className = `ei-nav-link ${item.highlight ? "is-highlight" : ""}`;
          return isMail ? (
            <a key={item.href} href={item.href} className={className}>
              {item.label}
            </a>
          ) : (
            <Link key={item.href} href={item.href} className={className}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export default function HomepageClient({
  tokscaleSummary,
}: {
  tokscaleSummary: TokscaleUsageData | null;
}) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const canAnimate = useHydrated() && !shouldReduceMotion;
  const { hero, nav, work, connect } = landingPageContent;
  const visibleWorkCards = work.cards.filter(
    (card) => !("isDraft" in card && card.isDraft),
  );
  const visibleConnectLinks = connect.links.filter(
    (link) => !("isDraft" in link && link.isDraft),
  );
  const identity = hero.note.split("\n")[0];
  const titleLines = hero.title.split(/\s+/).filter(Boolean);
  const heroMotionState = canAnimate ? "hidden" : false;
  const heroRevealVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.12,
        staggerChildren: 0.07,
      },
    },
  };
  const heroItemVariants = {
    hidden: { opacity: 0, transform: "translateY(18px)" },
    visible: {
      opacity: 1,
      transform: "translateY(0)",
      transition: {
        duration: 0.58,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <main className="ei-home">
      <HomeNav items={nav} />

      <motion.section
        id="home"
        className="ei-hero"
        aria-labelledby="home-heading"
        initial={heroMotionState}
        animate="visible"
        variants={heroRevealVariants}
      >
        <div className="ei-hero-media" aria-hidden="true">
          {canAnimate ? (
            <video
              className="ei-hero-video"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="/covers/ai-workflow-character.png"
              src={HERO_VIDEO_SRC}
            />
          ) : null}
          <div className="ei-hero-noise" />
          <div className="ei-hero-gradient" />
        </div>
        <div className="ei-hero-copy">
          <motion.p className="ei-kicker" variants={heroItemVariants}>
            {hero.eyebrow}
          </motion.p>
          <motion.h1
            id="home-heading"
            className="ei-hero-title"
            aria-label={hero.title}
            variants={heroItemVariants}
          >
            {titleLines.map((line, index) => (
              <span key={line} className="ei-hero-title-line">
                <WordsPullUp
                  text={line}
                  className="ei-hero-wordmark"
                  showAsterisk={index === titleLines.length - 1}
                />
              </span>
            ))}
          </motion.h1>
          <motion.p className="ei-identity" variants={heroItemVariants}>
            {identity}
          </motion.p>
          <motion.a className="ei-hero-cta" href="#work" variants={heroItemVariants}>
            <span>View the work</span>
            <span className="ei-hero-cta-icon" aria-hidden="true">
              ↗
            </span>
          </motion.a>
        </div>

        <motion.nav
          className="ei-index-rail"
          aria-label="Work index"
          variants={heroItemVariants}
        >
          <ol>
            {visibleWorkCards.map((card, index) => (
              <li
                key={card.slug}
                className={`ei-rail-item ${activeSlug === card.slug ? "is-active" : ""}`}
              >
                <a
                  href={card.href}
                  className="ei-rail-link"
                  onMouseEnter={() => setActiveSlug(card.slug)}
                  onMouseLeave={() => setActiveSlug(null)}
                  onFocus={() => setActiveSlug(card.slug)}
                  onBlur={() => setActiveSlug(null)}
                >
                  <span className="ei-rail-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="ei-rail-name">{card.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </motion.nav>
      </motion.section>

      <ProjectIndex
        headingNote={work.note}
        heading={work.eyebrow}
        cards={visibleWorkCards}
        onActivate={setActiveSlug}
      />

      <TokscaleUsageSection data={tokscaleSummary} />

      <section id="connect" className="ei-connect" aria-labelledby="connect-heading">
        <div className="ei-connect-callout">
          <div>
            <p className="ei-section-note">{connect.eyebrow}</p>
            <h2 id="connect-heading">{connect.title}</h2>
            <p className="ei-connect-summary">{connect.summary}</p>
          </div>
          <a href={connect.cta.href} className="ei-connect-button">
            {connect.cta.label}
          </a>
        </div>

        <ul className="ei-contact-grid" role="list">
          {visibleConnectLinks.map((link) => {
            const isExternal =
              link.href.startsWith("http") || link.href.startsWith("mailto:");
            return (
              <li key={link.label} className="ei-contact-cell">
                {isExternal ? (
                  <a
                    href={link.href}
                    className="ei-contact-link"
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    <span>{link.label}</span>
                    <strong>{link.value}</strong>
                  </a>
                ) : (
                  <Link href={link.href} className="ei-contact-link">
                    <span>{link.label}</span>
                    <strong>{link.value}</strong>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
