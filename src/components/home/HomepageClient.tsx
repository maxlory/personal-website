"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { LandingNavItem, LandingWorkCard } from "@/content/home";
import { landingPageContent } from "@/content/home";

const homeSectionOrder = ["home", "work", "connect"] as const;

function FloatingNav({
  items,
  activeSection,
}: {
  items: readonly LandingNavItem[];
  activeSection: string;
}) {
  return (
    <div className="clone-nav-shell">
      <nav className="clone-nav" aria-label="Homepage sections">
        <div className="clone-nav-orb" aria-hidden="true">
          <span />
        </div>
        <div className="clone-nav-links">
          {items.map((item) => {
            const isAnchor = item.href.startsWith("/#");
            const anchorId = isAnchor ? item.href.slice(2) : "";
            const isActive = anchorId === activeSection;
            const className = `clone-nav-link ${isActive ? "is-active" : ""} ${item.highlight ? "is-highlight" : ""}`;

            if (item.href.startsWith("mailto:")) {
              return (
                <a key={item.href} href={item.href} className={className}>
                  {item.label}
                </a>
              );
            }

            return (
              <Link key={item.href} href={item.href} className={className}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function WorkCardCover({ cover }: { cover: LandingWorkCard["cover"] }) {
  if (cover === "dashboard") {
    return (
      <div className="clone-cover clone-cover-dashboard">
        <Image
          src="/ai-enablement-cover-site.png"
          alt="AI Enablement cover"
          fill
          sizes="(max-width: 959px) 100vw, 60vw"
          className="clone-cover-image"
        />
      </div>
    );
  }

  if (cover === "mailroom") {
    return (
      <div className="clone-cover clone-cover-mailroom">
        <Image
          src="/selected-builds-cover.png"
          alt=""
          fill
          sizes="(max-width: 959px) 100vw, 42vw"
          className="clone-cover-image clone-cover-selected-builds-backdrop"
          aria-hidden="true"
        />
        <Image
          src="/selected-builds-cover.png"
          alt="Selected Builds cover"
          fill
          sizes="(max-width: 959px) 100vw, 42vw"
          className="clone-cover-image clone-cover-selected-builds-image"
        />
      </div>
    );
  }

  if (cover === "benchmark") {
    return (
      <div className="clone-cover clone-cover-benchmark">
        <div className="clone-cover-dot-field" />
        <div className="clone-cover-benchmark-badge" />
        <div className="clone-cover-benchmark-band" />
        <div className="clone-cover-benchmark-word">benchmark</div>
      </div>
    );
  }

  if (cover === "character") {
    return (
      <div className="clone-cover clone-cover-character">
        <Image
          src="/covers/ai-workflow-character.png"
          alt=""
          fill
          sizes="(max-width: 959px) 100vw, 42vw"
          className="clone-cover-image clone-cover-character-backdrop"
          aria-hidden="true"
        />
        <div className="clone-cover-character-foreground">
          <Image
            src="/covers/ai-workflow-character.png"
            alt="AI Workflow cover"
            fill
            sizes="(max-width: 959px) 70vw, 30vw"
            className="clone-cover-character-image"
          />
        </div>
      </div>
    );
  }

  if (cover === "workflow") {
    return (
      <div className="clone-cover clone-cover-workflow">
        <div className="clone-cover-workflow-sheet" />
        <div className="clone-cover-workflow-sheet second" />
        <div className="clone-cover-workflow-lane lane-one" />
        <div className="clone-cover-workflow-lane lane-two" />
        <div className="clone-cover-workflow-lane lane-three" />
      </div>
    );
  }

  if (cover === "research") {
    return (
      <div className="clone-cover clone-cover-research">
        <div className="clone-cover-research-mark" />
        <div className="clone-cover-research-title">Frame</div>
        <div className="clone-cover-research-rule" />
        <div className="clone-cover-research-rule short" />
        <div className="clone-cover-research-rule tiny" />
      </div>
    );
  }

  if (cover === "practice") {
    return (
      <div className="clone-cover clone-cover-practice">
        <div className="clone-cover-practice-window" />
        <div className="clone-cover-practice-window small" />
        <div className="clone-cover-practice-screen" />
      </div>
    );
  }

  if (cover === "systems") {
    return (
      <div className="clone-cover clone-cover-systems">
        <div className="clone-cover-systems-panel" />
        <div className="clone-cover-systems-node one" />
        <div className="clone-cover-systems-node two" />
        <div className="clone-cover-systems-node three" />
        <div className="clone-cover-systems-link one" />
        <div className="clone-cover-systems-link two" />
      </div>
    );
  }

  return (
    <div className="clone-cover clone-cover-ledger">
      <div className="clone-cover-ledger-board">
        <div className="clone-cover-ledger-column wide" />
        <div className="clone-cover-ledger-column" />
        <div className="clone-cover-ledger-column accent" />
      </div>
      <div className="clone-cover-ledger-rule" />
      <div className="clone-cover-ledger-rule short" />
    </div>
  );
}

function WorkCard({
  card,
  reduceMotion,
}: {
  card: LandingWorkCard;
  reduceMotion: boolean;
}) {
  const defaultTilt = card.hoverTilt ?? 0;

  return (
    <motion.div
      className={`clone-work-card placement-${card.placement}`}
      initial={reduceMotion ? false : { opacity: 0, y: 42, rotate: defaultTilt }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: defaultTilt }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.18, 0.9, 0.22, 1] }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -6,
              rotate: 0,
              transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
            }
      }
    >
      <Link href={card.href} className="clone-work-link">
        <div className="clone-work-cover">
          <WorkCardCover cover={card.cover} />
        </div>
        <div className="clone-work-meta">
          <div className="clone-work-title-row">
            <h3>{card.title}</h3>
            <span aria-hidden="true">↗</span>
          </div>
          {card.subtitleAccent ? (
            <div className="clone-work-subtitle-accent" aria-label={card.subtitle}>
              <span className="clone-work-subtitle-primary">
                {card.subtitleAccent.primary}
              </span>
              <span className="clone-work-subtitle-secondary">
                {card.subtitleAccent.secondary}
              </span>
            </div>
          ) : (
            <p className="clone-work-subtitle">{card.subtitle}</p>
          )}
          {card.meta ? <p className="clone-work-note">{card.meta}</p> : null}
        </div>
      </Link>
    </motion.div>
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

    if (sections.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.15, 0.3, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="clone-home">
      <FloatingNav items={nav} activeSection={activeSection} />

      <section id="home" className="clone-hero section-frame">
        <motion.div
          className="clone-hero-meta"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.18, 0.9, 0.22, 1] }}
        >
          <p className="clone-kicker">{hero.eyebrow}</p>
          <p className="clone-hero-note">{hero.note}</p>
        </motion.div>

        <motion.h1
          className="clone-hero-wordmark"
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.18, 0.9, 0.22, 1], delay: 0.08 }}
        >
          {hero.title}
        </motion.h1>
      </section>

      <section id="work" className="clone-section clone-work-section section-frame">
        <motion.div
          className="clone-section-heading centered"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: [0.18, 0.9, 0.22, 1] }}
        >
          <p className="clone-script-note">{work.note}</p>
          <h2 className="clone-block-title">{work.eyebrow}</h2>
        </motion.div>

        <div className="clone-work-grid">
          {visibleWorkCards.map((card) => (
            <WorkCard key={card.slug} card={card} reduceMotion={reduceMotion} />
          ))}
        </div>
      </section>

      <section id="connect" className="clone-section clone-connect-section section-frame">
        <motion.div
          className="clone-connect-callout"
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.18, 0.9, 0.22, 1] }}
        >
          <div>
            <p className="clone-kicker">{connect.eyebrow}</p>
            <h2>{connect.title}</h2>
            <p className="clone-connect-summary">{connect.summary}</p>
          </div>

          <a href={connect.cta.href} className="clone-connect-button">
            {connect.cta.label}
          </a>
        </motion.div>

        <motion.div
          className="clone-contact-grid"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.18, 0.9, 0.22, 1], delay: 0.06 }}
        >
          {visibleConnectLinks.map((link) => {
            const isExternal = link.href.startsWith("http") || link.href.startsWith("mailto:");

            if (isExternal) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="clone-contact-link"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  <span>{link.label}</span>
                  <strong>{link.value}</strong>
                </a>
              );
            }

            return (
              <Link key={link.label} href={link.href} className="clone-contact-link">
                <span>{link.label}</span>
                <strong>{link.value}</strong>
              </Link>
            );
          })}
        </motion.div>
      </section>
    </main>
  );
}
