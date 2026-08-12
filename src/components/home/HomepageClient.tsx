"use client";

import Link from "next/link";
import { useState } from "react";
import type { LandingNavItem } from "@/content/home";
import { landingPageContent } from "@/content/home";
import type { TokscaleUsageData } from "@/lib/tokscale/data";
import { ProjectIndex } from "./ProjectIndex";
import { TokscaleUsageSection } from "./tokscale/TokscaleUsageSection";

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
  const { hero, nav, work, connect } = landingPageContent;
  const visibleWorkCards = work.cards.filter(
    (card) => !("isDraft" in card && card.isDraft),
  );
  const visibleConnectLinks = connect.links.filter(
    (link) => !("isDraft" in link && link.isDraft),
  );
  const identity = hero.note.split("\n")[0];

  return (
    <main className="ei-home">
      <HomeNav items={nav} />

      <section id="home" className="ei-hero" aria-labelledby="home-heading">
        <div className="ei-hero-copy">
          <p className="ei-kicker">{hero.eyebrow}</p>
          <h1 id="home-heading" className="ei-hero-title">
            {hero.title}
          </h1>
          <p className="ei-identity">{identity}</p>
        </div>

        <nav className="ei-index-rail" aria-label="Work index">
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
        </nav>
      </section>

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
            <p className="ei-kicker">{connect.eyebrow}</p>
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
