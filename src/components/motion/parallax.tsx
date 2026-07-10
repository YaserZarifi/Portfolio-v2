"use client";

import { useRef } from "react";
import {
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { ReactNode } from "react";

/**
 * Cinematic parallax for imagery: the child drifts vertically against the
 * scroll inside an overflow-hidden frame, over-scaled so edges never peek.
 */
export function Parallax({
  children,
  amount = 36,
  className = "",
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const y = useTransform(smooth, [0, 1], [amount, -amount]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <m.div style={reduce ? undefined : { y, scale: 1.08 }}>{children}</m.div>
    </div>
  );
}
