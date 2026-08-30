"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { useHydrated } from "./useHydrated";

function AnimatedLetter({
  character,
  index,
  total,
  progress,
  reducedMotion,
}: {
  character: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const position = index / Math.max(total, 1);
  const opacity = useTransform(
    progress,
    [Math.max(0, position - 0.1), Math.min(1, position + 0.05)],
    [0.2, 1],
  );

  if (reducedMotion) {
    return <span aria-hidden="true">{character === " " ? "\u00a0" : character}</span>;
  }

  return (
    <motion.span aria-hidden="true" style={{ opacity }}>
      {character === " " ? "\u00a0" : character}
    </motion.span>
  );
}

export function AnimatedLetterReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const targetRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const isMounted = useHydrated();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.8", "end 0.2"],
  });

  return (
    <p ref={targetRef} className={className} aria-label={text}>
      <span aria-hidden="true">
        {Array.from(text).map((character, index) => (
          <AnimatedLetter
            key={`${character}-${index}`}
            character={character}
            index={index}
            total={text.length}
            progress={scrollYProgress}
            reducedMotion={isMounted && reducedMotion}
          />
        ))}
      </span>
    </p>
  );
}
