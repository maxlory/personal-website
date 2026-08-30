"use client";

import type { LandingWorkCard } from "@/content/home";
import { AnimatedLetterReveal } from "./AnimatedLetterReveal";
import { ProjectIndexCard } from "./ProjectIndexCard";
import { WordsPullUp } from "./WordsPullUp";

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
        <AnimatedLetterReveal className="ei-section-note" text={headingNote} />
        <h2 id="work-heading" className="ei-block-title">
          <WordsPullUp text={heading} />
        </h2>
      </header>
      <ul className="ei-project-grid" role="list">
        {cards.map((card, index) => (
          <ProjectIndexCard
            key={card.slug}
            card={card}
            index={index}
            onActivate={onActivate}
          />
        ))}
      </ul>
    </section>
  );
}
