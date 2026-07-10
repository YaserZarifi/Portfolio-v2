"use client";

import { m, useScroll, useSpring } from "motion/react";

/** Accent hairline under the header tracking page progress — dolly-smooth. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <m.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-14 z-40 h-[2px] origin-left bg-accent rtl:origin-right"
    />
  );
}
