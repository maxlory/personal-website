"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useHydrated } from "./useHydrated";

const wordVariants = {
  hidden: { opacity: 0, y: "110%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function WordsPullUp({
  text,
  className,
  showAsterisk = false,
}: {
  text: string;
  className?: string;
  showAsterisk?: boolean;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(rootRef, { once: true, margin: "-10% 0px" });
  const reducedMotion = Boolean(useReducedMotion());
  const staticMotion = useHydrated() && reducedMotion;
  const words = text.trim().split(/\s+/).filter(Boolean);

  return (
    <span ref={rootRef} className={`ei-words-pull-up ${className ?? ""}`} aria-label={text}>
      <span className="ei-words-pull-up-visual" aria-hidden="true">
        {words.map((word, index) => (
          <span className="ei-word-clip" key={`${word}-${index}`}>
            {staticMotion ? (
              <span className="ei-word">
                {word}
                {showAsterisk && index === words.length - 1 ? (
                  <sup className="ei-word-asterisk">*</sup>
                ) : null}
              </span>
            ) : (
              <motion.span
                className="ei-word"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={wordVariants}
                transition={{ delay: index * 0.08 }}
              >
                {word}
                {showAsterisk && index === words.length - 1 ? (
                  <sup className="ei-word-asterisk">*</sup>
                ) : null}
              </motion.span>
            )}
          </span>
        ))}
      </span>
    </span>
  );
}
