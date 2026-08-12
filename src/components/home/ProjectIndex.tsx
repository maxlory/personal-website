"use client";

import type { LandingWorkCard } from "@/content/home";
import { ProjectIndexCard } from "./ProjectIndexCard";

export function ProjectIndex({
  headingNote,
  heading,
  cards,
  onActivate,
}: {
  headingNote: string;
  heading: string;
  cards: readonly LandingWorkCard[];
  onActivate: (slug: string | null) => void;
}) {
  return (
    <section id="work" className="ei-work" aria-labelledby="work-heading">
      <header className="ei-work-heading">
        <p className="ei-kicker">{headingNote}</p>
        <h2 id="work-heading" className="ei-block-title">
          {heading}
        </h2>
      </header>
      <ul className="ei-project-grid" role="list">
        {cards.map((card) => (
          <ProjectIndexCard key={card.slug} card={card} onActivate={onActivate} />
        ))}
      </ul>
    </section>
  );
}
